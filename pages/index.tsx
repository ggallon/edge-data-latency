import { useCallback, useState } from "react"
import { BoltIcon } from "@heroicons/react/20/solid"
import {
  Badge,
  Button,
  ColGrid,
  Dropdown,
  DropdownItem,
  Text,
  Title,
} from "@tremor/react"
import Balancer from "react-wrap-balancer"
import { Chart } from "@/components/chart"
import { Checkbox } from "@/components/checkbox"
import { Code } from "@/components/code"
import {
  ConvexIcon,
  FaunaIcon,
  GrafbaseIcon,
  MongoIcon,
  PlanetScaleIcon,
  UpstashIcon,
  XataIcon,
} from "@/components/icons"

const ATTEMPTS = 10

type Region = "global" | "regional" | "fra1"
type Type = "edge" | "serverless"

export default function Page() {
  const [isTestRunning, setIsTestRunning] = useState(false)
  const [shouldTestGlobal, setShouldTestGlobal] = useState(true)
  const [shouldTestRegional, setShouldTestRegional] = useState(true)
  const [shouldTestServerless, setShouldTestServerless] = useState(true)
  const [queryCount, setQueryCount] = useState(1)
  const [dataService, setDataService] = useState("planetscale")
  const [data, setData] = useState({
    serverless: [],
    regional: [],
    global: [],
  })

  const runTest = useCallback(
    async (
      dataService: string,
      region: Region,
      type: Type,
      queryCount: number
    ) => {
      try {
        const start = Date.now()
        const res = await fetch(
          "global" === region
            ? `/api/${dataService}/global?count=${queryCount}`
            : `/api/${dataService}/${region}/${type}?count=${queryCount}`
        )
        const data = await res.json()
        const end = Date.now()
        return {
          ...data,
          elapsed: end - start,
        }
      } catch (e) {
        // instead of retrying we just give up
        return null
      }
    },
    []
  )

  const onRunTest = useCallback(async () => {
    setIsTestRunning(true)
    setData({ serverless: [], regional: [], global: [] })

    for (let i = 0; i < ATTEMPTS; i++) {
      let serverlessValue = null
      let regionalValue = null
      let globalValue = null

      if (shouldTestServerless) {
        serverlessValue = await runTest(
          dataService,
          "regional",
          "serverless",
          queryCount
        )
      }

      if (shouldTestRegional) {
        regionalValue = await runTest(
          dataService,
          "regional",
          "edge",
          queryCount
        )
      }

      if (shouldTestGlobal) {
        globalValue = await runTest(dataService, "global", "edge", queryCount)
      }

      setData((data) => {
        return {
          ...data,
          serverless: [...data.serverless, serverlessValue],
          regional: [...data.regional, regionalValue],
          global: [...data.global, globalValue],
        }
      })
    }

    setIsTestRunning(false)
  }, [
    runTest,
    queryCount,
    dataService,
    shouldTestGlobal,
    shouldTestRegional,
    shouldTestServerless,
  ])

  return (
    <main className="mx-auto max-w-5xl p-6 sm:p-10">
      <div className="flex items-center justify-start gap-2">
        <Title>
          Client &lt;--&gt; (Edge | Serverless) &lt;--&gt; Data latency
        </Title>
        <Badge text="BETA" size="xs" color="red" />
      </div>
      <Text>
        <Balancer ratio={0.5}>
          This demo helps observe the latency characteristics of querying
          different popular data services from varying compute locations.
        </Balancer>
      </Text>

      <form className="my-5 flex flex-col gap-5 rounded-xl bg-gray-100 p-5">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Databases for Serverless & Edge</p>
          <p className="text-sm text-gray-500">
            <Balancer ratio={0.5}>
              The databases and backend spaces for developers building
              applications with serverless and edge compute.
            </Balancer>
          </p>

          <div className="inline-flex py-2">
            <Dropdown
              defaultValue={dataService}
              onValueChange={(v) => setDataService(v)}
              maxWidth="max-w-xs"
            >
              <DropdownItem
                value="planetscale"
                text="PlanetScale (Kysely + database-js)"
                icon={PlanetScaleIcon}
              />
              <DropdownItem
                value="mongo"
                text="MongoDB (Data API)"
                icon={MongoIcon}
              />
              <DropdownItem
                value="supabase"
                text="Supabase (supabase-js)"
                icon={BoltIcon}
              />
              <DropdownItem
                value="upstash"
                text="Upstash (SDK)"
                icon={UpstashIcon}
              />
              <DropdownItem
                value="neon"
                text="Neon (Kysely + neondatabase-js)"
                icon={XataIcon}
              />
              <DropdownItem
                value="grafbase"
                text="Grafbase (GraphQL)"
                icon={GrafbaseIcon}
              />
              <DropdownItem
                value="fauna"
                text="Fauna (GraphQL API)"
                icon={FaunaIcon}
              />
              <DropdownItem
                value="convex"
                text="Convex (SDK)"
                icon={ConvexIcon}
              />
              <DropdownItem value="xata" text="Xata (SDK)" icon={XataIcon} />
            </Dropdown>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Location</p>
          <p className="text-sm text-gray-500">
            <Balancer ratio={0.5}>
              Vercel Edge Functions support multiple regions. By default
              they&apos;re global, but it&apos;s possible to express a region
              preference via the <Code className="text-xs">region</Code>{" "}
              setting.
            </Balancer>
          </p>
          <fieldset className="flex flex-col py-2 sm:flex-row sm:gap-3">
            <legend className="sr-only">Location</legend>
            <Checkbox
              name="global"
              label="Global Edge"
              description="function"
              isChecked={shouldTestGlobal}
              onChangeEvent={setShouldTestGlobal}
            />
            <Checkbox
              name="regional"
              label="Regional Edge"
              description="function"
              isChecked={shouldTestRegional}
              onChangeEvent={setShouldTestRegional}
            />
            <Checkbox
              name="serverless"
              label="Regional Serverless"
              description="function"
              isChecked={shouldTestServerless}
              onChangeEvent={setShouldTestServerless}
            />
          </fieldset>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Waterfall</p>
          <p className="text-sm text-gray-500">
            <Balancer ratio={0.5}>
              Executing complex API routes globally can be slow when the
              database is single-region, due to having multiple roundtrips to a
              single server that&apos;s distant from the user.
            </Balancer>
          </p>
          <p className="flex flex-wrap gap-3 gap-y-1 py-2 text-sm">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="1"
                onChange={() => setQueryCount(1)}
                checked={queryCount === 1}
              />{" "}
              Single query (no waterfall)
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="2"
                onChange={() => setQueryCount(2)}
                checked={queryCount === 2}
              />{" "}
              2 serial queries
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="5"
                onChange={() => setQueryCount(5)}
                checked={queryCount === 5}
              />{" "}
              5 serial queries
            </label>
          </p>
        </div>

        <div>
          <Button onClick={onRunTest} loading={isTestRunning}>
            Run Test
          </Button>
        </div>

        {data.serverless.length ||
        data.regional.length ||
        data.global.length ? (
          <ColGrid numCols={1} numColsMd={2} gapX="gap-x-5" gapY="gap-y-5">
            <Chart
              title="Latency distribution (processing time)"
              attempts={ATTEMPTS}
              data={data}
              param="queryDuration"
            >
              This is how long it takes for the edge or serverless function to
              run the queries and return the result. Your internet connections{" "}
              <b>will not</b> influence these results.
            </Chart>
            <Chart
              title="Latency distribution (end-to-end)"
              attempts={ATTEMPTS}
              data={data}
              param="elapsed"
            >
              This is the total latency from the client&apos;s perspective. It
              considers the total roundtrip between browser and edge or
              serverless. Your internet connection and location <b>will</b>{" "}
              influence these results.
            </Chart>
          </ColGrid>
        ) : null}
      </form>
    </main>
  )
}
