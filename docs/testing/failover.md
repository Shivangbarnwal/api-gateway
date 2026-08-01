Scenario 1
----------

Stop users1

Expected:
Gateway routes traffic to users2.

Scenario 2
----------

Stop users1 and users2

Expected:
503 Service Unavailable

Scenario 3
----------

Restart users1

Expected:
Gateway resumes forwarding requests after health check.