# Github Trends ETL Pipeline

### Service Goals:

* HTTP Handler:
  - [X] Validate Input
  - [ ] Check Existing Data
  - [X] Job Dispatch
* ETL Worker:
  - [x] Long Running
  - [x] Uploads Data To S3
  - [x] No Http, Invoke Only

### Endpoints:
1. `/?repo=facebook/react`

### TODO:
- [ ] Don't Let Multiple Jobs For Same Repo Run At Same Time
- [ ] ???
