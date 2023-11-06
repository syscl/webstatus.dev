# Copyright 2023 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

FROM node:20.8.1-alpine3.18

WORKDIR /work
ARG service_dir
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY ${service_dir}/package.json ${service_dir}/package.json
COPY lib/gen/openapi/ lib/gen/openapi/
WORKDIR /work/${service_dir}
RUN npm install --ignore-scripts
COPY ${service_dir}/ /work/${service_dir}/
RUN npm run postinstall || true
RUN npm run build

CMD npm run start