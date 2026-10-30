export const routeLoaders = {
  '/': () => import('../pages/HomePage'),
  '/advisory': () => import('../pages/AdvisoryPage'),
  '/development': () => import('../pages/DevelopmentPage'),
  '/website-development': () => import('../pages/WebsitePage'),
  '/tools': () => import('../pages/ToolsPage'),
  '/intelligence': () => import('../pages/IntelligencePage'),
  '/contact': () => import('../pages/ContactPage'),
  '/success-profiles': () => import('../pages/SuccessProfilesPage'),
  '/applications': () => import('../pages/ApplicationsPage'),
  '/workflow-automation': () => import('../pages/WorkflowAutomationPage'),
};
