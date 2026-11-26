import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

// Cabeçalho padrão das telas internas
const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, action }) => (
  <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h1 className="text-2xl font-light tracking-wide text-gray-800 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
    {action && <div className="sm:shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
