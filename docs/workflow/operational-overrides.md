# Operational Overrides

Project-level policy overrides for AprovaAI React Native client.

## Precedence Order

1. User explicit instruction in current chat
2. This file (`docs/workflow/operational-overrides.md`)
3. Plugin defaults (`rules/operational-guardrails.mdc`)

## Overrides

```yaml
# No overrides defined yet.
# Add entries here to override plugin defaults for this project.
#
# Example:
# aws_sso_profile: aprova-ai-dev
# lambda_deploy_script: scripts/deploy-lambda.sh
```

## Notes

- Omitted policy = default plugin behavior applies.
- Keep overrides minimal and well-commented.
