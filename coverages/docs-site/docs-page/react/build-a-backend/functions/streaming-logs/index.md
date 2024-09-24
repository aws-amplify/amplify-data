[<- Back to index](../../../../../docs-pages.md)

#  Snippets

Page: https://docs.amplify.aws/react/build-a-backend/functions/streaming-logs/

Coverage: 0.0%

#### `Terminal`

~~~
npx ampx sandbox --stream-function-logs

~~~

| | |
| -- | -- |
| Hash | `33f9097052947ee1` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx sandbox --stream-function-logs --logs-filter auth

~~~

| | |
| -- | -- |
| Hash | `14db1ad6078cc1c5` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
> npx ampx sandbox --stream-function-logs --logs-filter auth
...

✨  Total time: 158.44s

[Sandbox] Watching for file changes...
File written: amplify_outputs.json
[auth-pre-sign-up] 3:36:34 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-pre-sign-up] 3:36:34 PM START RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91 Version: $LATEST
[auth-pre-sign-up] 3:36:34 PM END RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91
[auth-pre-sign-up] 3:36:34 PM REPORT RequestId: 685be2bd-5df1-4dd5-9eb1-24f5f6337f91	Duration: 4.12 ms	Billed Duration: 5 ms	Memory Size: 512 MB	Max Memory Used: 67 MB	Init Duration: 173.67 ms
[auth-post-confirmation] 3:38:40 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-post-confirmation] 3:38:40 PM START RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7 Version: $LATEST
[auth-post-confirmation] 3:38:41 PM 2024-07-19T22:38:41.209Z	fce69b9f-b257-4af8-8a6e-821f84a39ce7	INFO	processed 412f8911-acfa-41c7-9605-fa0c40891ea9
[auth-post-confirmation] 3:38:41 PM END RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7
[auth-post-confirmation] 3:38:41 PM REPORT RequestId: fce69b9f-b257-4af8-8a6e-821f84a39ce7	Duration: 264.38 ms	Billed Duration: 265 ms	Memory Size: 512 MB	Max Memory Used: 93 MB	Init Duration: 562.19 ms
[auth-pre-authentication] 3:38:41 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-pre-authentication] 3:38:41 PM START RequestId: 9210ca3a-1351-4826-8544-123684765710 Version: $LATEST
[auth-pre-authentication] 3:38:41 PM END RequestId: 9210ca3a-1351-4826-8544-123684765710
[auth-pre-authentication] 3:38:41 PM REPORT RequestId: 9210ca3a-1351-4826-8544-123684765710	Duration: 3.47 ms	Billed Duration: 4 ms	Memory Size: 512 MB	Max Memory Used: 67 MB	Init Duration: 180.24 ms
[auth-post-authentication] 3:38:42 PM INIT_START Runtime Version: nodejs:18.v30	Runtime Version ARN: arn:aws:lambda:us-east-1::runtime:f89c264158db39a1cfcbb5f9b3741413df1cfce4d550c9a475a67d923e19e2f4
[auth-post-authentication] 3:38:42 PM START RequestId: 60c1d680-ea24-4a8b-93de-02d085859140 Version: $LATEST
[auth-post-authentication] 3:38:42 PM END RequestId: 60c1d680-ea24-4a8b-93de-02d085859140
[auth-post-authentication] 3:38:42 PM REPORT RequestId: 60c1d680-ea24-4a8b-93de-02d085859140	Duration: 4.61 ms	Billed Duration: 5 ms	Memory Size: 512 MB	Max Memory Used: 68 MB	Init Duration: 172.66 ms

~~~

| | |
| -- | -- |
| Hash | `ce51bced5be61da3` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx sandbox --stream-function-logs --logs-out-file sandbox.log

~~~

| | |
| -- | -- |
| Hash | `db3ab66f8ffdd6e0` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

#### `Terminal`

~~~
npx ampx sandbox --stream-function-logs --logs-filter auth --logs-out-file sandbox-auth.log

~~~

| | |
| -- | -- |
| Hash | `c37fd7aefe79328f` |
| Covered | ❌ |

##### Covering Regions

- *None*

---

[<- Back to index](../../../../../docs-pages.md)
