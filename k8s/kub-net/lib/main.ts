import { Construct } from 'constructs';
import * as k from 'cdk8s';

import {
  KubeService,
  KubeConfigMap,
  KubeDeployment,
  KubePersistentVolume,
  KubePersistentVolumeClaim,
} from '../imports/k8s';

export class MyChart extends k.Chart {
  constructor(scope: Construct, id: string, props: k.ChartProps = {}) {
    super(scope, id, props);

    const label = { app: 'kub-net-app' };
  }
}

const app = new k.App();
new MyChart(app, 'kub-net');
app.synth();
