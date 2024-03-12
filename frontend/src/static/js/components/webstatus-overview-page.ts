/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {consume} from '@lit/context';
import {Task} from '@lit/task';
import {LitElement, type TemplateResult, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';
import {type components} from 'webstatus.dev-backend';

import {type APIClient} from '../api/client.js';
import {apiClientContext} from '../contexts/api-client-context.js';
import './webstatus-overview-content.js';

@customElement('webstatus-overview-page')
export class OverviewPage extends LitElement {
  loadingTask: Task;

  @consume({context: apiClientContext})
  apiClient?: APIClient;

  @state()
  features: Array<components['schemas']['Feature']> = [];

  location!: {search: string}; // Set by router.

  constructor() {
    super();
    this.loadingTask = new Task(this, {
      args: () => [this.apiClient],
      task: async ([apiClient]) => {
        if (typeof apiClient === 'object') {
          this.features = await apiClient.getFeatures();
        }
        return this.features;
      },
    });
  }

  render(): TemplateResult {
    return html`
      <webstatus-overview-content
        .location=${this.location}
        .features=${this.features}
        .loadingTask=${this.loadingTask}
      >
      </webstatus-overview-content>
    `;
  }
}
