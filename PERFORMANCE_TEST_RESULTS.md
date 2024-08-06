TODO: There are at least five (meaningful) performance tests written with k6, included in the k6 folder. Performance test results are included in the PERFORMANCE_TEST_RESULTS.md that is included in the assignment template.


## Creates randomusers to simulate question creation without rate limit(1 minute for a user)
  execution: local
     script: k6/submission.js
     output: -

  scenarios: (100.00%) 1 scenario, 20 max VUs, 1m0s max duration (incl. graceful stop):
           * default: 20 looping VUs for 30s (gracefulStop: 30s)


     data_received..................: 4.8 MB 159 kB/s
     data_sent......................: 5.7 MB 189 kB/s
     http_req_blocked...............: avg=3.91µs  min=0s     med=1µs     max=2.85ms   p(90)=3µs     p(95)=4µs    
     http_req_connecting............: avg=1.1µs   min=0s     med=0s      max=2.01ms   p(90)=0s      p(95)=0s     
     http_req_duration..............: avg=25.4ms  min=3.45ms med=16.32ms max=215.71ms p(90)=49.56ms p(95)=56.28ms
       { expected_response:true }...: avg=25.4ms  min=3.45ms med=16.32ms max=215.71ms p(90)=49.56ms p(95)=56.28ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 23486
     http_req_receiving.............: avg=37.7µs  min=4µs    med=22µs    max=16.65ms  p(90)=74µs    p(95)=94µs   
     http_req_sending...............: avg=12.9µs  min=2µs    med=7µs     max=14.73ms  p(90)=20µs    p(95)=23µs   
     http_req_tls_handshaking.......: avg=0s      min=0s     med=0s      max=0s       p(90)=0s      p(95)=0s     
     http_req_waiting...............: avg=25.34ms min=3.43ms med=16.27ms max=215.67ms p(90)=49.49ms p(95)=56.21ms
     http_reqs......................: 23486  781.980526/s
     iteration_duration.............: avg=25.55ms min=3.51ms med=16.44ms max=215.83ms p(90)=49.77ms p(95)=56.5ms 
     iterations.....................: 23486  781.980526/s
     vus............................: 20     min=20       max=20 
     vus_max........................: 20     min=20       max=20 


## Stress testing for GET /courses/{id} randomly choose course id

     checks.........................: 100.00% ✓ 1006      ✗ 0   
     data_received..................: 24 MB   768 kB/s
     data_sent......................: 90 kB   2.9 kB/s
     http_req_blocked...............: avg=33.11µs  min=1µs    med=5µs     max=4.07ms p(90)=7µs     p(95)=39.24µs
     http_req_connecting............: avg=21.9µs   min=0s     med=0s      max=2.83ms p(90)=0s      p(95)=0s     
     http_req_duration..............: avg=22.41ms  min=4.51ms med=15.74ms max=1.34s  p(90)=25.73ms p(95)=30.9ms 
       { expected_response:true }...: avg=22.41ms  min=4.51ms med=15.74ms max=1.34s  p(90)=25.73ms p(95)=30.9ms 
     http_req_failed................: 0.00%   ✓ 0         ✗ 1006
     http_req_receiving.............: avg=536.33µs min=29µs   med=472µs   max=7.81ms p(90)=933µs   p(95)=1.11ms 
     http_req_sending...............: avg=22.34µs  min=2µs    med=21µs    max=245µs  p(90)=29.5µs  p(95)=46.74µs
     http_req_tls_handshaking.......: avg=0s       min=0s     med=0s      max=0s     p(90)=0s      p(95)=0s     
     http_req_waiting...............: avg=21.85ms  min=4.17ms med=15.06ms max=1.34s  p(90)=25.09ms p(95)=30.42ms
     http_reqs......................: 1006    32.580108/s
     iteration_duration.............: avg=1.02s    min=1s     med=1.01s   max=2.34s  p(90)=1.02s   p(95)=1.03s  
     iterations.....................: 1006    32.580108/s
     vus............................: 1       min=1       max=50
     vus_max........................: 50      min=50      max=50


  ## Stress testing for homepage (course list) choose course id
  
     data_received..................: 153 MB 5.1 MB/s
     data_sent......................: 521 kB 17 kB/s
     http_req_blocked...............: avg=6.79µs   min=0s     med=2µs      max=5.48ms   p(90)=4µs      p(95)=4µs     
     http_req_connecting............: avg=2.96µs   min=0s     med=0s       max=2.34ms   p(90)=0s       p(95)=0s      
     http_req_duration..............: avg=154.72ms min=2.73ms med=164.59ms max=363.21ms p(90)=250.96ms p(95)=268.18ms
       { expected_response:true }...: avg=154.72ms min=2.73ms med=164.59ms max=363.21ms p(90)=250.96ms p(95)=268.18ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 6514
     http_req_receiving.............: avg=135.24µs min=14µs   med=77µs     max=12.01ms  p(90)=217µs    p(95)=438.69µs
     http_req_sending...............: avg=10.04µs  min=1µs    med=7µs      max=3.38ms   p(90)=15µs     p(95)=18µs    
     http_req_tls_handshaking.......: avg=0s       min=0s     med=0s       max=0s       p(90)=0s       p(95)=0s      
     http_req_waiting...............: avg=154.58ms min=2.68ms med=164.49ms max=363.13ms p(90)=250.79ms p(95)=268.02ms
     http_reqs......................: 6514   217.103482/s
     iteration_duration.............: avg=154.79ms min=2.77ms med=164.65ms max=363.25ms p(90)=251.01ms p(95)=268.31ms
     iterations.....................: 6514   217.103482/s
     vus............................: 1      min=1        max=50
     vus_max........................: 50     min=50       max=50 


# 10 Virtual User ( each time different user ) up votes question 
data_received..................: 1.6 MB 162 kB/s
     data_sent......................: 1.8 MB 180 kB/s
     http_req_blocked...............: avg=2.38µs  min=0s     med=1µs    max=1.24ms   p(90)=3µs     p(95)=3µs    
     http_req_connecting............: avg=573ns   min=0s     med=0s     max=521µs    p(90)=0s      p(95)=0s     
     http_req_duration..............: avg=11.74ms min=1.37ms med=8.65ms max=532.26ms p(90)=20.55ms p(95)=27.09ms
       { expected_response:true }...: avg=11.74ms min=1.37ms med=8.65ms max=532.26ms p(90)=20.55ms p(95)=27.09ms
     http_req_failed................: 0.00%  ✓ 0          ✗ 8445
     http_req_receiving.............: avg=31.82µs min=7µs    med=25µs   max=2.22ms   p(90)=55µs    p(95)=67µs   
     http_req_sending...............: avg=10.86µs min=2µs    med=9µs    max=3.65ms   p(90)=16µs    p(95)=21µs   
     http_req_tls_handshaking.......: avg=0s      min=0s     med=0s     max=0s       p(90)=0s      p(95)=0s     
     http_req_waiting...............: avg=11.7ms  min=1.33ms med=8.61ms max=532.21ms p(90)=20.51ms p(95)=27ms   
     http_reqs......................: 8445   830.809097/s
     iteration_duration.............: avg=11.85ms min=1.43ms med=8.75ms max=532.74ms p(90)=20.66ms p(95)=27.19ms
     iterations.....................: 8444   830.710718/s
     vus............................: 10     min=10       max=10
     vus_max........................: 10     min=10       max=10