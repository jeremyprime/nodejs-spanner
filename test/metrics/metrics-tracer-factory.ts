/*!
 * Copyright 2025 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from 'assert';
import * as sinon from 'sinon';
import {MetricsTracerFactory} from '../../src/metrics/metrics-tracer-factory';
import * as constants from '../../src/metrics/constants';
import {MeterProvider} from '@opentelemetry/sdk-metrics';

describe('MetricsTracerFactory', () => {
  let sandbox: sinon.SinonSandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    const meterStub = {
      createHistogram: sinon.stub(),
      createCounter: sinon.stub(),
    };

    sandbox.stub(MeterProvider.prototype, 'getMeter').returns(meterStub as any);

    meterStub.createHistogram.returns({histogram: true});
    meterStub.createCounter.returns({counter: true});
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should initialize metric instruments when enabled', () => {
    const factory = new MetricsTracerFactory(true);

    assert.deepStrictEqual(factory.instrumentAttemptLatency, {histogram: true});
    assert.deepStrictEqual(factory.instrumentAttemptCounter, {counter: true});
    assert.deepStrictEqual(factory.instrumentOperationLatency, {
      histogram: true,
    });
    assert.deepStrictEqual(factory.instrumentOperationCounter, {counter: true});
  });

  it('should create a MetricsTracer instance', () => {
    const factory = new MetricsTracerFactory(true);
    const tracer = factory.createMetricsTracer();
    assert.ok(tracer);
  });

  it('should correctly set project attribute', () => {
    const factory = new MetricsTracerFactory(true);
    factory.project = 'test-project';
    assert.strictEqual(
      factory.clientAttributes[constants.MONITORED_RES_LABEL_KEY_PROJECT],
      'test-project',
    );
  });

  it('should correctly set instance attribute', () => {
    const factory = new MetricsTracerFactory(true);
    factory.instance = 'my-instance';
    assert.strictEqual(
      factory.clientAttributes[constants.MONITORED_RES_LABEL_KEY_INSTANCE],
      'my-instance',
    );
  });

  it('should correctly set instanceConfig attribute', () => {
    const factory = new MetricsTracerFactory(true);
    factory.instanceConfig = 'my-config';
    assert.strictEqual(
      factory.clientAttributes[
        constants.MONITORED_RES_LABEL_KEY_INSTANCE_CONFIG
      ],
      'my-config',
    );
  });

  it('should correctly set location attribute', () => {
    const factory = new MetricsTracerFactory(true);
    factory.location = 'us-central1';
    assert.strictEqual(
      factory.clientAttributes[constants.MONITORED_RES_LABEL_KEY_LOCATION],
      'us-central1',
    );
  });

  it('should correctly set clientHash attribute', () => {
    const factory = new MetricsTracerFactory(true);
    factory.clientHash = 'abc123';
    assert.strictEqual(
      factory.clientAttributes[constants.MONITORED_RES_LABEL_KEY_CLIENT_HASH],
      'abc123',
    );
  });

  it('should correctly set clientUid attribute', () => {
    const factory = new MetricsTracerFactory(true);
    factory.clientUid = 'uid123';
    assert.strictEqual(
      factory.clientAttributes[constants.METRIC_LABEL_KEY_CLIENT_UID],
      'uid123',
    );
  });

  it('should correctly set clientName attribute', () => {
    const factory = new MetricsTracerFactory(true);
    factory.clientName = 'client-app';
    assert.strictEqual(
      factory.clientAttributes[constants.METRIC_LABEL_KEY_CLIENT_NAME],
      'client-app',
    );
  });

  it('should correctly set database attribute', () => {
    const factory = new MetricsTracerFactory(true);
    factory.database = 'my-database';
    assert.strictEqual(
      factory.clientAttributes[constants.METRIC_LABEL_KEY_DATABASE],
      'my-database',
    );
  });
});
