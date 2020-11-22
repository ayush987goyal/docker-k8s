import { Construct } from 'constructs';
import * as k from 'cdk8s';

import { KubeService, KubeDeployment } from '../imports/k8s';

class UsersService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const label = { app: 'kub-net-users' };

    new KubeService(this, 'users-service', {
      spec: {
        selector: label,
        type: 'LoadBalancer',
        ports: [{ port: 8080, targetPort: 8080 }],
      },
    });

    new KubeDeployment(this, 'users-deployment', {
      spec: {
        selector: { matchLabels: label },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'users',
                image: 'ayush987goyal/kube-net-demo-users:1',
                env: [{ name: 'AUTH_ADDRESS', value: 'localhost' }],
              },
              {
                name: 'auth',
                image: 'ayush987goyal/kube-net-demo-auth:1',
              },
            ],
          },
        },
      },
    });
  }
}

export class MyChart extends k.Chart {
  constructor(scope: Construct, id: string, props: k.ChartProps = {}) {
    super(scope, id, props);

    new UsersService(this, 'users');
  }
}

const app = new k.App();
new MyChart(app, 'kub-net');
app.synth();
