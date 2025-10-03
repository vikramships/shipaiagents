export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  template: string;
  variables: TemplateVariable[];
  examples?: TemplateExample[];
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'select';
  description: string;
  required: boolean;
  default?: any;
  options?: string[]; // for select type
}

export interface TemplateExample {
  name: string;
  description: string;
  variables: Record<string, any>;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'custom-safety-agent',
    name: 'Custom Safety Agent',
    description: 'Create a custom safety agent for your specific project needs',
    category: 'safety-security',
    template: `# {{name}}

## Safety Rules for {{projectName}}

### File System Safety
{{#if fileSystemRules}}
{{fileSystemRules}}
{{else}}
- NEVER execute rm, rmdir, or destructive commands without explicit confirmation
- Always backup before file operations that modify multiple files
{{/if}}

### Project-Specific Rules
{{#if projectRules}}
{{projectRules}}
{{/if}}

### Custom Validation Rules
{{#if validationRules}}
{{validationRules}}
{{/if}}

## Usage Instructions
{{usageInstructions}}

## Contact
For questions about these safety rules, contact {{contactEmail}}.`,
    variables: [
      {
        name: 'name',
        type: 'string',
        description: 'Agent name',
        required: true
      },
      {
        name: 'projectName',
        type: 'string',
        description: 'Project name',
        required: true
      },
      {
        name: 'fileSystemRules',
        type: 'string',
        description: 'Custom file system safety rules',
        required: false
      },
      {
        name: 'projectRules',
        type: 'string',
        description: 'Project-specific safety rules',
        required: false
      },
      {
        name: 'validationRules',
        type: 'string',
        description: 'Custom validation rules',
        required: false
      },
      {
        name: 'usageInstructions',
        type: 'string',
        description: 'Instructions for using this agent',
        required: true
      },
      {
        name: 'contactEmail',
        type: 'string',
        description: 'Contact email for questions',
        required: false
      }
    ],
    examples: [
      {
        name: 'React Project Safety',
        description: 'Safety rules for React development',
        variables: {
          name: 'React Safety Guardian',
          projectName: 'MyReactApp',
          fileSystemRules: '- Never delete node_modules without confirmation\n- Always test changes before committing',
          projectRules: '- Use TypeScript for type safety\n- Follow React best practices',
          validationRules: '- Check for PropTypes usage\n- Validate component props',
          usageInstructions: 'This agent helps maintain code safety in React projects.',
          contactEmail: 'dev@company.com'
        }
      }
    ]
  },
  {
    id: 'code-review-agent',
    name: 'Code Review Agent',
    description: 'Create a custom code review agent for your team',
    category: 'quality-testing',
    template: `# {{name}}

## Code Review Guidelines for {{teamName}}

### Review Focus Areas
{{#each reviewAreas}}
- {{this}}
{{/each}}

### Code Quality Standards
{{#if qualityStandards}}
{{qualityStandards}}
{{else}}
- Code must be readable and maintainable
- Follow team coding conventions
- Include appropriate tests
{{/if}}

### Performance Requirements
{{#if performanceRequirements}}
{{performanceRequirements}}
{{/if}}

### Security Checklist
{{#if securityChecklist}}
{{securityChecklist}}
{{/if}}

## Review Process
1. {{step1}}
2. {{step2}}
3. {{step3}}

## Approval Criteria
{{approvalCriteria}}`,
    variables: [
      {
        name: 'name',
        type: 'string',
        description: 'Agent name',
        required: true
      },
      {
        name: 'teamName',
        type: 'string',
        description: 'Team name',
        required: true
      },
      {
        name: 'reviewAreas',
        type: 'array',
        description: 'Areas to focus on during review',
        required: true
      },
      {
        name: 'qualityStandards',
        type: 'string',
        description: 'Code quality standards',
        required: false
      },
      {
        name: 'performanceRequirements',
        type: 'string',
        description: 'Performance requirements',
        required: false
      },
      {
        name: 'securityChecklist',
        type: 'string',
        description: 'Security review checklist',
        required: false
      },
      {
        name: 'step1',
        type: 'string',
        description: 'First step in review process',
        required: true
      },
      {
        name: 'step2',
        type: 'string',
        description: 'Second step in review process',
        required: true
      },
      {
        name: 'step3',
        type: 'string',
        description: 'Third step in review process',
        required: true
      },
      {
        name: 'approvalCriteria',
        type: 'string',
        description: 'Criteria for approving code changes',
        required: true
      }
    ]
  }
];

export function getTemplateById(id: string): AgentTemplate | undefined {
  return AGENT_TEMPLATES.find(template => template.id === id);
}

export function getAllTemplates(): AgentTemplate[] {
  return AGENT_TEMPLATES;
}

export function getTemplatesByCategory(category: string): AgentTemplate[] {
  return AGENT_TEMPLATES.filter(template => template.category === category);
}