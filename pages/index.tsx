import { useCallback, useState } from 'react';
import { AreaChart, Badge, Button, Card, ColGrid, Dropdown, DropdownItem, Text, Title } from '@tremor/react';
import {
  BoltIcon,
} from '@heroicons/react/20/solid';

import { Code } from "@/components/code"
import { FaunaIcon, GrafbaseIcon, PlanetScaleIcon, UpstashIcon } from "@/components/icons"
import { dataFormatter } from "@/utils/data-formatter";

const ATTEMPTS = 10;

type Region = 'global' | 'regional' | 'fra1';
type Type = 'edge' | 'serverless';

export default function Page() {
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [shouldTestGlobal, setShouldTestGlobal] = useState(true);
  const [shouldTestRegional, setShouldTestRegional] = useState(true);
  const [shouldTestServerless, setShouldTestServerless] = useState(true);
  const [queryCount, setQueryCount] = useState(1);
  const [dataService, setDataService] = useState('planetscale');
  const [data, setData] = useState({
    serverless: [],
    regional: [],
    global: [],
  });

  const runTest = useCallback(
    async (dataService: string, region: Region, type: Type,  queryCount: number) => {
      try {
        const start = Date.now();
        const res = await fetch(
          'global' === region 
            ? `/api/${dataService}/global?count=${queryCount}`
            : `/api/${dataService}/${region}/${type}?count=${queryCount}`
        );
        const data = await res.json();
        const end = Date.now();
        return {
          ...data,
          elapsed: end - start,
        };
      } catch (e) {
        // instead of retrying we just give up
        return null;
      }
    },
    []
  );

  const onRunTest = useCallback(async () => {
    setIsTestRunning(true);
    setData({ serverless: [], regional: [], global: [] });

    for (let i = 0; i < ATTEMPTS; i++) {
      let serverlessValue = null;
      let regionalValue = null;
      let globalValue = null;

      if (shouldTestServerless) {
        serverlessValue = await runTest(dataService, 'regional', 'serverless', queryCount);
      }

      if (shouldTestRegional) {
        regionalValue = await runTest(dataService, 'regional', 'edge', queryCount);
      }

      if (shouldTestGlobal) {
        globalValue = await runTest(dataService, 'global', 'edge', queryCount);
      }

      setData((data) => {
        return {
          ...data,
          serverless: [...data.serverless, serverlessValue],
          regional: [...data.regional, regionalValue],
          global: [...data.global, globalValue],
        };
      });
    }

    setIsTestRunning(false);
  }, [runTest, queryCount, dataService, shouldTestGlobal, shouldTestRegional, shouldTestServerless]);

  return (
    <main className="max-w-5xl p-6 sm:p-10 mx-auto">
      <div className="flex justify-start items-center gap-2">
        <Title>Edge &lt;&gt; Data latency</Title>
        <Badge text="BETA" size="xs" color="red" />
      </div>
      <Text>
        This demo helps observe the latency characteristics of querying
        different popular data services from varying compute locations.
      </Text>

      <form className="flex flex-col gap-5 bg-gray-100 p-5 my-5 rounded-xl">
        <div className="flex flex-col gap-1">
          <p className="font-bold">Data service</p>
          <p className="text-gray-500 text-sm">
            Vercel Edge Functions support multiple regions. By default
            they&apos;re global, but it&apos;s possible to express a region
            preference via the <Code className="text-xs">region</Code> setting.
          </p>

          <div className="py-1 inline-flex">
            <Dropdown
              defaultValue={dataService}
              onValueChange={(v) => setDataService(v)}
              maxWidth="max-w-xs"
            >
              {/*
              <DropdownItem
                value="grafbase"
                text="Grafbase (GraphQL)"
                icon={GrafbaseIcon}
              />
              */}
              <DropdownItem
                value="planetscale"
                text="PlanetScale (Kysely + database-js)"
                icon={PlanetScaleIcon}
              />
              {/*
              <DropdownItem
                value="shopify"
                text="Shopify (Storefront GraphQL API)"
                icon={ShoppingCartIcon}
              />
              */}
              <DropdownItem
                value="supabase"
                text="Supabase (supabase-js)"
                icon={BoltIcon}
              />
              <DropdownItem
                value="fauna"
                text="Fauna (faunadb.js)"
                icon={FaunaIcon}
              />
              {/*
              <DropdownItem
                value="xata"
                text="Xata (SDK)"
                icon={XataIcon}
              />
              */}
              <DropdownItem
                value="upstash"
                text="Upstash (SDK)"
                icon={UpstashIcon}
              />
            </Dropdown>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Location</p>
          <p className="text-gray-500 text-sm">
            Vercel Edge Functions support multiple regions. By default
            they&apos;re global, but it&apos;s possible to express a region
            preference via the <Code className="text-xs">region</Code> setting.
          </p>
          <p className="text-sm flex gap-3 flex-wrap gap-y-1">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                disabled
                name="region"
                value="global"
                checked={shouldTestGlobal}
                onChange={(e) => setShouldTestGlobal(e.target.checked)}
              />{' '}
              Test global function
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                disabled
                name="region"
                value="regional"
                checked={shouldTestRegional}
                onChange={(e) => setShouldTestRegional(e.target.checked)}
              />{' '}
              Test regional [fra1] edge function
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="checkbox"
                disabled
                name="serverless"
                value="serverless"
                checked={shouldTestServerless}
                onChange={(e) => setShouldTestServerless(e.target.checked)}
              />{' '}
              Test regional [fra1] serverless function
            </label>
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-bold">Waterfall</p>
          <p className="text-gray-500 text-sm">
            Executing complex API routes globally can be slow when the database
            is single-region, due to having multiple roundtrips to a single
            server that&apos;s distant from the user.
          </p>
          <p className="text-sm flex gap-3 flex-wrap gap-y-1">
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="1"
                onChange={() => setQueryCount(1)}
                checked={queryCount === 1}
              />{' '}
              Single query (no waterfall)
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="2"
                onChange={() => setQueryCount(2)}
                checked={queryCount === 2}
              />{' '}
              2 serial queries
            </label>
            <label className="flex items-center gap-2 whitespace-nowrap">
              <input
                type="radio"
                name="queries"
                value="5"
                onChange={() => setQueryCount(5)}
                checked={queryCount === 5}
              />{' '}
              5 serial queries
            </label>
          </p>
        </div>

        <div>
          <Button onClick={onRunTest} loading={isTestRunning}>
            Run Test
          </Button>
        </div>

        {data.serverless.length || data.regional.length || data.global.length ? (
          <ColGrid numCols={1} numColsMd={2} gapX="gap-x-5" gapY="gap-y-5">
            <Card>
              <Title truncate={true}>
                Latency distribution (processing time)
              </Title>
              <Text height="h-14">
                This is how long it takes for the edge or serverless function to run the
                queries and return the result. Your internet connections{' '}
                <b>will not</b> influence these results.
              </Text>

              <AreaChart
                data={new Array(ATTEMPTS).fill(0).map((_, i) => {
                  return {
                    attempt: `#${i + 1}`,
                    Serverless: data.serverless[i]
                      ? data.serverless[i].queryDuration
                      : null,
                    Regional: data.regional[i]
                      ? data.regional[i].queryDuration
                      : null,
                    Global: data.global[i]
                      ? data.global[i].queryDuration
                      : null,
                  };
                })}
                dataKey="attempt"
                categories={['Global', 'Regional', 'Serverless']}
                colors={['indigo', 'cyan', 'yellow']}
                valueFormatter={dataFormatter}
                marginTop="mt-6"
                yAxisWidth="w-12"
              />
            </Card>
            <Card>
              <Title truncate={true}>Latency distribution (end-to-end)</Title>
              <Text height="h-14">
                This is the total latency from the client&apos;s perspective. It
                considers the total roundtrip between browser and edge or serverless. Your
                internet connection and location <b>will</b> influence these
                results.
              </Text>

              <AreaChart
                data={new Array(ATTEMPTS).fill(0).map((_, i) => {
                  return {
                    attempt: `#${i + 1}`,
                    Serverless: data.serverless[i]
                      ? data.serverless[i].elapsed
                      : null,
                    Regional: data.regional[i]
                      ? data.regional[i].elapsed
                      : null,
                    Global: data.global[i] ? data.global[i].elapsed : null,
                  };
                })}
                dataKey="attempt"
                categories={['Global', 'Regional', 'Serverless']}
                colors={['indigo', 'cyan', 'yellow']}
                valueFormatter={dataFormatter}
                marginTop="mt-6"
                yAxisWidth="w-12"
              />
            </Card>
          </ColGrid>
        ) : null}
      </form>
    </main>
  );
}

