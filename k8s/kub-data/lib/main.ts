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

    const label = { app: 'kub-data-app' };
    const persistentVolumeName = 'host-pv';
    const persistentVolumeClaimName = 'host-pvc';
    const configMapName = 'data-store-env';

    new KubePersistentVolume(this, 'story-persistent-volume', {
      metadata: { name: persistentVolumeName },
      spec: {
        capacity: { storage: '1Gi' },
        volumeMode: 'Filesystem',
        storageClassName: 'standard',
        accessModes: ['ReadWriteOnce'],
        hostPath: { path: '/data', type: 'DirectoryOrCreate' },
      },
    });

    new KubePersistentVolumeClaim(this, 'story-persistent-volume-claim', {
      metadata: { name: persistentVolumeClaimName },
      spec: {
        volumeName: persistentVolumeName,
        accessModes: ['ReadWriteOnce'],
        storageClassName: 'standard',
        resources: {
          requests: { storage: '1Gi' },
        },
      },
    });

    new KubeConfigMap(this, 'data-store', {
      metadata: { name: configMapName },
      data: {
        folder: 'story',
      },
    });

    new KubeService(this, 'story-service', {
      spec: {
        type: 'LoadBalancer',
        ports: [{ port: 80, targetPort: 3000 }],
        selector: label,
      },
    });

    new KubeDeployment(this, 'story-deployment', {
      spec: {
        replicas: 2,
        selector: {
          matchLabels: label,
        },
        template: {
          metadata: { labels: label },
          spec: {
            containers: [
              {
                name: 'story',
                image: 'ayush987goyal/kub-data-demo:2',
                env: [
                  {
                    name: 'STORY_FOLDER',
                    valueFrom: {
                      configMapKeyRef: { name: configMapName, key: 'folder' },
                    },
                  },
                ],
                volumeMounts: [
                  { mountPath: '/app/story', name: 'story-volume' },
                ],
              },
            ],
            volumes: [
              {
                name: 'story-volume',
                persistentVolumeClaim: { claimName: persistentVolumeClaimName },
              },
            ],
          },
        },
      },
    });
  }
}

const app = new k.App();
new MyChart(app, 'kub-data');
app.synth();
