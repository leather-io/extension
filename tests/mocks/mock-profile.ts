export const mockGaiaProfileResponse = [
  {
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJqdGkiOiIwYTFkNGVhZC01YmQyLTQzYWYtYmQ5YS0wMWRiNTcxZTA0NmUiLCJpYXQiOiIyMDI0LTAzLTEzVDE4OjI5OjQxLjI1N1oiLCJleHAiOiIyMDI1LTAzLTEzVDE4OjI5OjQxLjI1N1oiLCJzdWJqZWN0Ijp7InB1YmxpY0tleSI6IjAzMjliMDc2YmMyMGY3YjE1OTJiMmExYTVjYjkxZGZlZmU4Yzk2NmU1MGUyNTY0NThlMjNkZDJjNWQ2M2Y4ZjFhZiJ9LCJpc3N1ZXIiOnsicHVibGljS2V5IjoiMDMyOWIwNzZiYzIwZjdiMTU5MmIyYTFhNWNiOTFkZmVmZThjOTY2ZTUwZTI1NjQ1OGUyM2RkMmM1ZDYzZjhmMWFmIn0sImNsYWltIjp7IkB0eXBlIjoiUGVyc29uIiwiQGNvbnRleHQiOiJodHRwOi8vc2NoZW1hLm9yZyIsImFwcHMiOnsiaHR0cDovL2xvY2FsaG9zdDozMDAwIjoiaHR0cHM6Ly9nYWlhLmhpcm8uc28vaHViLzFKdmkxTmlZSGFNdmpVZFRhbTRITHJQU2RVakg1TXFONUYvIn0sImFwcHNNZXRhIjp7Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCI6eyJzdG9yYWdlIjoiaHR0cHM6Ly9nYWlhLmhpcm8uc28vaHViLzFKdmkxTmlZSGFNdmpVZFRhbTRITHJQU2RVakg1TXFONUYvIiwicHVibGljS2V5IjoiMDNkNGQ2ODA2Yzc3NjA1MWFjNDJiZjgzODVmYmNiNmRhODRlYzcxNjkxOTRkNmU4ZDZlMWJjNzRlY2I5YmM0MGNlIn19LCJuYW1lIjoiTmFtZSAxNzEwMzUxMjEyNTA5IiwiaW1hZ2UiOlt7IkB0eXBlIjoiSW1hZ2VPYmplY3QiLCJuYW1lIjoiYXZhdGFyIiwiY29udGVudFVybCI6Imh0dHBzOi8vYnl6YW50aW9uLm15cGluYXRhLmNsb3VkL2lwZnMvUW1iODRVY2FNcjFNVXdOYllCblhXSE0za0VhRGNZckt1UFd3eVJMVlROS0VMQy8yMjU2LnBuZyJ9LHsiQHR5cGUiOiJJbWFnZU9iamVjdCIsIm5hbWUiOiJiYWNrZ3JvdW5kIiwiY29udGVudFVybCI6Imh0dHBzOi8vdW5zcGxhc2guY29tL3Bob3Rvcy9oMFZ4Z3o1dHlYQS9kb3dubG9hZD9peGlkPU1ud3hNakEzZkRCOE1YeHpaV0Z5WTJoOE1ueDhZbUZqYTJkeWIzVnVaSHhsYm53d2ZEQjhmSHd4TmpZMk5EQTBOemt4JmZvcmNlPXRydWUmdz02NDAifV0sInNhbWVBcyI6WyJodHRwczovL3R3aXR0ZXIuY29tL3R3aXR0ZXJIYW5kbGUiLCJodHRwczovL2luc3RhZ3JhbS5jb20vaW5zdGFIYW5kbGUiXSwib3ducyI6W3siQHR5cGUiOiJPd25lcnNoaXBJbmZvIiwiaWRlbnRpZmllciI6ImJpcDEyMjowMDAwMDAwMDAwMTlkNjY4OWMwODVhZTE2NTgzMWU5MzoxMmNiUUxURk1YUm5Temt0Rmt1b0czZUhvTWVGdHBUdTNTIn1dfX0.I0qDc2l6iZrRVXAc7GLPxngmRloZfCukugj3GuFHyZHxJtsy3oIs3sroQcXGzkLlxAI35HAra4BH0uO5hMpWeA',
    decodedToken: {
      header: {
        typ: 'JWT',
        alg: 'ES256K',
      },
      payload: {
        jti: '0a1d4ead-5bd2-43af-bd9a-01db571e046e',
        iat: '2024-03-13T18:29:41.257Z',
        exp: '2025-03-13T18:29:41.257Z',
        subject: {
          publicKey: '0329b076bc20f7b1592b2a1a5cb91dfefe8c966e50e256458e23dd2c5d63f8f1af',
        },
        issuer: {
          publicKey: '0329b076bc20f7b1592b2a1a5cb91dfefe8c966e50e256458e23dd2c5d63f8f1af',
        },
        claim: {
          '@type': 'Person',
          '@context': 'http://schema.org',
          apps: {
            'http://localhost:3000': 'https://gaia.hiro.so/hub/1Jvi1NiYHaMvjUdTam4HLrPSdUjH5MqN5F/',
          },
          appsMeta: {
            'http://localhost:3000': {
              storage: 'https://gaia.hiro.so/hub/1Jvi1NiYHaMvjUdTam4HLrPSdUjH5MqN5F/',
              publicKey: '03d4d6806c776051ac42bf8385fbcb6da84ec7169194d6e8d6e1bc74ecb9bc40ce',
            },
          },
          name: 'Name 1710351212509',
          image: [
            {
              '@type': 'ImageObject',
              name: 'avatar',
              contentUrl:
                'https://byzantion.mypinata.cloud/ipfs/Qmb84UcaMr1MUwNbYBnXWHM3kEaDcYrKuPWwyRLVTNKELC/2256.png',
            },
            {
              '@type': 'ImageObject',
              name: 'background',
              contentUrl:
                'https://unsplash.com/photos/h0Vxgz5tyXA/download?ixid=MnwxMjA3fDB8MXxzZWFyY2h8Mnx8YmFja2dyb3VuZHxlbnwwfDB8fHwxNjY2NDA0Nzkx&force=true&w=640',
            },
          ],
          sameAs: ['https://twitter.com/twitterHandle', 'https://instagram.com/instaHandle'],
          owns: [
            {
              '@type': 'OwnershipInfo',
              identifier:
                'bip122:000000000019d6689c085ae165831e93:12cbQLTFMXRnSzktFkuoG3eHoMeFtpTu3S',
            },
          ],
        },
      },
      signature:
        'I0qDc2l6iZrRVXAc7GLPxngmRloZfCukugj3GuFHyZHxJtsy3oIs3sroQcXGzkLlxAI35HAra4BH0uO5hMpWeA',
    },
  },
];
