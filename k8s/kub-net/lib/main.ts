import { Construct } from 'constructs';
import * as k from 'cdk8s';

import { KubeService, KubeDeployment } from '../imports/k8s';

class UsersService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const label = { app: 'kub-net-users' };

    new KubeService(this, 'users-service', {
      metadata: { name: 'users-service' },
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
                env: [{ name: 'AUTH_ADDRESS', value: 'auth-service.default' }],
              },
            ],
          },
        },
      },
    });
  }
}

class AuthService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const label = { app: 'kub-net-auth' };

    new KubeService(this, 'auth-service', {
      metadata: { name: 'auth-service' },
      spec: {
        selector: label,
        type: 'ClusterIP',
        ports: [{ port: 80, targetPort: 80 }],
      },
    });

    new KubeDeployment(this, 'auth-deployment', {
      spec: {
        selector: { matchLabels: label },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
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

class TasksService extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    const label = { app: 'kub-net-tasks' };

    new KubeService(this, 'tasks-service', {
      metadata: { name: 'tasks-service' },
      spec: {
        selector: label,
        type: 'LoadBalancer',
        ports: [{ port: 8000, targetPort: 8000 }],
      },
    });

    new KubeDeployment(this, 'tasks-deployment', {
      spec: {
        selector: { matchLabels: label },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'tasks',
                image: 'ayush987goyal/kube-net-demo-tasks:2',
                env: [
                  { name: 'AUTH_ADDRESS', value: 'auth-service.default' },
                  { name: 'TASKS_FOLDER', value: 'tasks' },
                ],
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

    new AuthService(this, 'auth');
    new UsersService(this, 'users');
    new TasksService(this, 'tasks');
  }
}

const app = new k.App();
new MyChart(app, 'kub-net');
app.synth();
