import React from 'react';

const LinksView: React.FC = () => {
  return (
    <div className="links-view text-xs">
      {/* Header - same style as calendar */}
      <div className="grid grid-cols-7">
        <div className="col-span-5 text-left pl-2 py-1 font-bold text-xl">
          +LINKS
        </div>
        <div className="col-span-2 flex items-center justify-end space-x-1 text-xs px-2 py-1">
        </div>
      </div>
      {/* Day names row height equivalent */}
      <div className="grid grid-cols-7">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="text-right pr-1 py-0.5 invisible">_</div>
        ))}
      </div>
      {/* Content area - matches 5 calendar rows of h-20 */}
      <div className="border-t border-black" style={{ minHeight: 'calc(5 * 5rem)' }}>
        <div className="p-4">
          <p>+ em breve</p>
        </div>
      </div>
    </div>
  );
};

export default LinksView;