import { Construct } from 'constructs';
import * as k from 'cdk8s';
// import * as kplus from 'cdk8s-plus-17';

export class MyChart extends k.Chart {
  constructor(scope: Construct, id: string, props: k.ChartProps = {}) {
    super(scope, id, props);
  }
}

const app = new k.App();
new MyChart(app, 'kub-data');
app.synth();
