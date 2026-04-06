export interface BillTemplate {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  bills: {
    name: string;
    amount: string;
    dueDate: string;
    isRecurring: boolean;
    recurrenceDays: number[];
    isEmergency: boolean;
    category: string;
  }[];
}

const TEMPLATES_STORAGE_KEY = 'lockedin_bill_templates';

export function saveTemplate(template: Omit<BillTemplate, 'id' | 'createdAt'>): BillTemplate {
  const templates = getTemplates();
  const newTemplate: BillTemplate = {
    ...template,
    id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };

  templates.push(newTemplate);
  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));

  return newTemplate;
}

export function getTemplates(): BillTemplate[] {
  try {
    const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading templates:', error);
    return [];
  }
}

export function getTemplate(id: string): BillTemplate | null {
  const templates = getTemplates();
  return templates.find(t => t.id === id) || null;
}

export function updateTemplate(id: string, updates: Partial<Omit<BillTemplate, 'id' | 'createdAt'>>): boolean {
  const templates = getTemplates();
  const index = templates.findIndex(t => t.id === id);

  if (index === -1) return false;

  templates[index] = {
    ...templates[index],
    ...updates,
  };

  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(templates));
  return true;
}

export function deleteTemplate(id: string): boolean {
  const templates = getTemplates();
  const filtered = templates.filter(t => t.id !== id);

  if (filtered.length === templates.length) return false;

  localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function createTemplateFromCycleBills(cycleBills: any[], templateName: string, description?: string): BillTemplate {
  const bills = cycleBills.map(bill => ({
    name: bill.name || '',
    amount: ((Number(bill.amount) || 0) / 10_000_000).toString(),
    dueDate: new Date(Number(bill.due_date) * 1000).toISOString().split('T')[0],
    isRecurring: bill.is_recurring || false,
    recurrenceDays: bill.recurrence_calendar || [],
    isEmergency: bill.is_emergency || false,
    category: bill.category?.tag || 'Other',
  }));

  return saveTemplate({
    name: templateName,
    description,
    bills,
  });
}
