import { Construct } from 'constructs';
import * as k from 'cdk8s';
import * as kplus from 'cdk8s-plus-17';

export class MyChart extends k.Chart {
  constructor(scope: Construct, id: string, props: k.ChartProps = {}) {
    super(scope, id, props);

    const deployment = new kplus.Deployment(this, 'Deployment', {
      containers: [
        {
          name: 'kub-first-app',
          image: 'ayush987goyal/kub-first-app',
          port: 8080,
          liveness: kplus.Probe.fromHttpGet('/', {
            port: 8080,
            periodSeconds: k.Duration.seconds(10),
            initialDelaySeconds: k.Duration.seconds(5),
          }),
        },
      ],
    });

    deployment.expose(8080, {
      serviceType: kplus.ServiceType.LOAD_BALANCER,
    });
  }
}

const app = new k.App();
new MyChart(app, 'kub-action');
app.synth();
