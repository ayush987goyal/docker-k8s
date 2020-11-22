import { Construct } from 'constructs';
import * as k from 'cdk8s';
import * as kplus from 'cdk8s-plus-17';

export class MyChart extends k.Chart {
  constructor(scope: Construct, id: string, props: k.ChartProps = {}) {
    super(scope, id, props);

    const storyDeployment = new kplus.Deployment(this, 'story-deployment', {
      containers: [
        {
          image: 'ayush987goyal/kub-data-demo:1',
          volumeMounts: [
            {
              path: '/app/story',
              volume: kplus.Volume.fromEmptyDir('story-volume'),
            },
          ],
        },
      ],
    });

    storyDeployment.expose(80, {
      targetPort: 3000,
      serviceType: kplus.ServiceType.LOAD_BALANCER,
    });
  }
}

const app = new k.App();
new MyChart(app, 'kub-data');
app.synth();
