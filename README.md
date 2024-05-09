# Facets Cloud Docker Image Push Action

This GitHub Action automates the process of pushing Docker images to the Facets Cloud control plane using the `@facets-cloud/facetsctl` CLI. It allows for automated deployments and updates, handling authentication, image details, and optional parameters such as descriptions and artifact registration.

## Features

- **Easy Authentication**: Configures authentication automatically using your provided credentials.
- **Flexible Configuration**: Supports various command line options to tailor the push process according to your needs.
- **Git Integration**: Optionally auto-detects the current Git reference to include with your image deployment.

## Prerequisites

To use this action, you need:
- A Docker image ready to be pushed.
- Credentials for accessing the Facets Cloud platform.

## Inputs

| Name                | Description                                                        | Required |
|---------------------|--------------------------------------------------------------------|----------|
| `username`          | Facets Cloud username for authentication.                          | Yes      |
| `token`             | Facets Cloud access token for authentication.                      | Yes      |
| `cp-url`            | URL to the Facets Cloud control plane.                             | Yes      |
| `docker-image`      | Full name and tag of the Docker image (e.g., `repo/image:tag`).    | Yes      |
| `artifact-name`     | Name of the artifact as defined in the blueprint.                  | Yes      |
| `external-id`       | External identifier for the artifact.                              | Yes      |
| `description`       | Description of the build, if any.                                  | No       |
| `artifactory`       | Artifactory location where the image will be pushed.               | No       |
| `debug`             | Enables debugging mode to see detailed error messages.             | No       |
| `registration-type` | Mode of registration (`CLUSTER` or `RELEASE_STREAM`).              | Conditional |
| `registration-value`| Value for the release stream or cluster ID, based on registration mode. | Conditional |
| `git-ref`           | Git reference to provide if specific versioning is required.       | Conditional |
| `autodetect-git-ref`| Auto-detect the current Git branch or tag.                         | No       |

## Outputs

No outputs are defined for this action.

## Example Usage

```yaml
name: Deploy Docker Image to Facets Cloud
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Push Docker Image to Facets Cloud
        uses: ./.github/actions/facets-cloud-deploy
        with:
          username: ${{ secrets.FACETS_USERNAME }}
          token: ${{ secrets.FACETS_TOKEN }}
          cp-url: "https://api.facets.cloud"
          docker-image: "myrepo/myapp:latest"
          artifact-name: "myapp"
          external-id: "app-external-id"
          description: "Latest deployment of myapp"
          registration-type: "RELEASE_STREAM"
          registration-value: "stable"
          debug: "true"
          autodetect-git-ref: "true"
```

## Debugging and Troubleshooting

If you encounter issues during the execution of this action, ensure:
- All required inputs are correctly provided.
- The Facets Cloud control plane URL is accessible.
- The provided credentials are valid and have sufficient permissions.

Enable the `debug` flag for detailed error outputs to troubleshoot issues effectively.

## Support

For additional help or information about the Facets Cloud platform, please refer to the official documentation at [Facets Cloud Documentation](https://www.facets.cloud/docs) or contact support.
