import { useState, useEffect } from 'react';
import { getTemplates, deleteTemplate, type BillTemplate } from '../util/templates';
import ConfirmModal from './ConfirmModal';

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadTemplate: (template: BillTemplate) => void;
}

export default function TemplateManager({ isOpen, onClose, onLoadTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<BillTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<BillTemplate | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = () => {
    setTemplates(getTemplates());
  };

  const handleDelete = (template: BillTemplate) => {
    setSelectedTemplate(template);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedTemplate) {
      deleteTemplate(selectedTemplate.id);
      loadTemplates();
      setSelectedTemplate(null);
    }
  };

  const handleLoad = (template: BillTemplate) => {
    onLoadTemplate(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '16px',
          animation: 'fadeIn 0.2s ease-out'
        }}
        onClick={onClose}
      >
        <div
          style={{
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '800px',
            width: '100%',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-xl)',
            animation: 'slideUp 0.2s ease-out'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div style={{
            padding: '24px',
            borderBottom: '1px solid var(--color-border)'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              marginBottom: '8px',
              color: 'var(--color-text-primary)'
            }}>
              Bill Templates
            </h3>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-text-secondary)'
            }}>
              Load a saved template to quickly add bills to a new cycle.
            </p>
          </div>

          {/* Templates List */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px'
          }}>
            {templates.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 24px',
                color: 'var(--color-text-secondary)'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <p style={{ fontSize: '16px', marginBottom: '8px' }}>No templates yet</p>
                <p style={{ fontSize: '14px' }}>Save your first template from an existing cycle.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {templates.map((template) => (
                  <div
                    key={template.id}
                    style={{
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      transition: 'var(--transition-base)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          marginBottom: '4px',
                          color: 'var(--color-text-primary)'
                        }}>
                          {template.name}
                        </h4>
                        {template.description && (
                          <p style={{
                            fontSize: '13px',
                            color: 'var(--color-text-secondary)',
                            marginBottom: '8px'
                          }}>
                            {template.description}
                          </p>
                        )}
                        <p style={{
                          fontSize: '12px',
                          color: 'var(--color-text-tertiary)'
                        }}>
                          {template.bills.length} bill{template.bills.length !== 1 ? 's' : ''} • Created {new Date(template.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                        <button
                          onClick={() => handleLoad(template)}
                          style={{
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                            color: '#0f1419',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'var(--transition-base)',
                            boxShadow: 'var(--shadow-sm)',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          Load
                        </button>
                        <button
                          onClick={() => handleDelete(template)}
                          style={{
                            background: 'rgba(248, 113, 113, 0.15)',
                            color: 'var(--color-error)',
                            border: '1px solid var(--color-error)',
                            padding: '8px 16px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'var(--transition-base)',
                            whiteSpace: 'nowrap'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {/* Bills Preview */}
                    <div style={{
                      marginTop: '12px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--color-border)'
                    }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: 'var(--color-text-secondary)',
                        marginBottom: '8px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        Bills in this template:
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {template.bills.slice(0, 3).map((bill, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: '13px',
                              color: 'var(--color-text-secondary)',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>{bill.name}</span>
                            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              ${parseFloat(bill.amount).toFixed(2)}
                            </span>
                          </div>
                        ))}
                        {template.bills.length > 3 && (
                          <div style={{
                            fontSize: '12px',
                            color: 'var(--color-text-tertiary)',
                            fontStyle: 'italic'
                          }}>
                            +{template.bills.length - 3} more...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                color: 'var(--color-text-secondary)',
                border: '1px solid var(--color-border)',
                padding: '10px 20px',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'var(--transition-base)'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Template?"
        message={`Are you sure you want to delete "${selectedTemplate?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonStyle="danger"
      />
    </>
  );
}
