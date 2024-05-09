import { Blocks } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ClusterHeading } from "@/modules/clusters/cluster-information/components/clusterHeading";
import { LabelsCard } from "@/modules/clusters/cluster-information/components/LabelsCard";
import { AddonsTabs } from "@/modules/clusters/cluster-information/components/AddonsTable/AddonsTabs";
import { ClusterConfig } from "@/modules/clusters/cluster-information/components/ClusterConfig";
import useClusterInfo from "@/modules/clusters/cluster-information/hooks/useClusterInfo";
import { useParams } from "react-router-dom";
import { ClusterInfoType, ClusterType, Label } from "@/types/cluster.types";
import { useEffect, useState } from "react";
import { HelmReleaseType } from "@/types/helm.types";

export const data = {
  name: "Cluster 1",
  version: "v1.22.3",
  namespace: "namespace1",
  type: "clusterAPI",
  status: true,
  addons: {
    helmCharts: [
      {
        namespace: "default/clusterapi-workload",
        type: "helm chart",
        name: "kyverno",
        version: "kyverno-latest",
        chart_version: "3.1.4",
        date: "2024-04-20 13:07:47 +0200 CEST",
        profile: "ClusterProfile/deploy-kyverno",
      },
      {
        namespace: "default/clusterapi-workload",
        type: "helm chart",
        name: "nginx",
        version: "nginx-latest",
        chart_version: "1.1.3",
        date: "2024-04-20 13:08:10 +0200 CEST",
        profile: "ClusterProfile/nginx",
      },
    ],
    resources: [
      {
        namespace: "default/clusterapi-workload",
        type: "kyverno.io:ClusterPolicy",
        name: "",
        version: "disallow-latest-tag",
        chart_version: "N/A",
        date: "2024-04-20 13:13:42 +0200 CEST",
        profile: "ClusterProfile/deploy-resources",
      },
    ],
  },
  labels: [
    {
      designation: "env:production",
      color: "red",
    },
    {
      designation: "eune:prod4",
      color: "red",
    },
    {
      designation: "alpha:1224",
      color: "red",
    },
    {
      designation: "euw:devp2",
      color: "red",
    },
    {
      designation: "na:devp1",
      color: "red",
    },
    {
      designation: "euw:devp1",
      color: "red",
    },
    {
      designation: "euw:devp1",
      color: "green",
    },
  ],
};

export function ClusterInfo() {
  const { tab: type, name, namespace } = useParams();
  const [infoData, setInfoData] = useState<ClusterInfoType | null>(null);
  const [helmReleaseData, setHelmReleaseData] = useState<HelmReleaseType[] | {}>({});
  const queries = useClusterInfo(namespace, name, type as ClusterType);
  const [resourcesQuery, helmChartQuery, InfoQuery] = queries;
  useEffect(() => {
    if (
      resourcesQuery.isSuccess &&
      helmChartQuery.isSuccess &&
      InfoQuery.isSuccess &&
      InfoQuery.data.managedClusters.length > 0
    ) {
      setInfoData(InfoQuery.data.managedClusters[0]);
      setHelmReleaseData(helmChartQuery.data.helmReleases)
    }
  }, [queries]);

  const resourcesData = resourcesQuery.data;
  const helmChartData = helmChartQuery.data;
  const addonTypes = [
    { value: 'all', label: 'All' },
    { value: 'resource', label: 'Resources' },
    { value: 'helm', label: 'Helm Charts' }
  ];
  const addonsData={
    all: [
      {
        cluster: 'default/clusterapi-workload',
        resourceType: 'helm chart',
        namespace: 'kyverno',
        name: 'kyverno-latest',
        version: '3.1.4',
        time: '2023-07-12 10:42 AM',
        profiles: 'ClusterProfile/deploy-kyverno'
      },

    ],
    resource: [
      helmReleaseData
    ],
    helm:helmReleaseData
  }
  return (
    <div>
      <div>
        <main>
          <div className="mx-auto grid mt-4 flex-1 auto-rows-max gap-4">
            {InfoQuery.isSuccess && infoData && (
              <ClusterHeading
                name={infoData.name}
                status={infoData?.clusterInfo.ready}
                namespace={infoData.namespace}
                version={infoData?.clusterInfo.version}
              />
            )}
            <div className="grid gap-4 md:grid-cols-[1fr_150px] lg:grid-cols-3 ">
              {addonsData && helmChartQuery.isSuccess  &&  (
                <AddonsTabs addonTypes={addonTypes} addonsData={addonsData} />
                )
              }
              <div className="grid auto-rows-max items-start gap-4 ">
                {InfoQuery.isSuccess && infoData && (
                  <LabelsCard labels={infoData?.clusterInfo?.labels} />
                )}
                <ClusterConfig />
                <Card x-chunk="dashboard-07-chunk-5">
                  <CardHeader>
                    <CardTitle className={"flex items-center"}>
                      <Blocks className={"w-4 h-4"} /> Cluster Configuration
                    </CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div></div>
                    <Button size="sm" variant="secondary">
                      Archive Product
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm">Save Product</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
