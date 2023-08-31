# Leather messages

All Leather instances make HTTP requests to the file located in `config/wallet-config.json`. If there are messages, either global or pinned to a matching version, they will be displayed on the wallet's home screen.

If there are no messages, the object should be empty: `{}`

If there are active fiat providers, they will be display in the 'Buy' page.

The schema of the `wallet-comms.json` file is validated by Github Actions.

### Example

A message targeting all versions is referred to with the key `global`. The JSON may look something like:

```json
{
  "messages": {
    "global": [
      {
        "purpose": "info",
        "title": "API experiencing slowness",
        "text": "Balances and transactions may take longer to update",
        "learnMoreUrl": "https://stacks.co",
        "publishedAt": "2021-09-27T07:57:37.397Z",
        "dismissible": false
      }
    ]
  },
  "activeFiatProviders": {
    "transak": { "name": "transak", "enabled": true }
  }
}
```
