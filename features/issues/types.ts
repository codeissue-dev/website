export type NewIssueCopy = {
  fields: {
    title: string;
    titlePlaceholder: string;
    projectType: string;
    projectTypes: Record<string, string>;
    brief: string;
    briefPlaceholder: string;
    outcome: string;
    outcomePlaceholder: string;
    contactChannel: string;
    contactHandle: string;
    contactHandlePlaceholder: string;
    budget: string;
    budgetPlaceholder: string;
  };
  submit: string;
  submitting: string;
  errors: Record<string, string>;
};
