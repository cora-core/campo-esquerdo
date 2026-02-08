import React from 'react';

interface LinkItem {
  label: string;
  url: string;
}

const LinksView: React.FC = () => {
  const links: LinkItem[] = [
    {
      label: 'EMAIL',
      url: 'mailto:campo.esquerdo@gmail.com',
    },
    {
      label: 'INSTAGRAM',
      url: 'https://instagram.com/campo.esquerdo',
    },
    {
      label: 'YOUTUBE',
      url: 'https://www.youtube.com/@CampoEsquerdo',
    },
  ];

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
      <div className="border-t border-black flex flex-col items-center justify-center" style={{ minHeight: 'calc(5 * 4rem)' }}>
        <div className="grid grid-cols-3 gap-10 p-4">
          {links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-black flex flex-col items-center justify-center w-24 h-24 hover:bg-black hover:text-white transition-colors"
              >
                <span className="text-xs font-semibold tracking-wide">
                  {link.label}
                </span>
                <svg
                  width="62.47"
                  height="7.95"
                  viewBox="0 0 62.47 7.95"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mt-2 w-10"
                >
                  <polyline
                    points=".11 7.46 31.24 .51 62.36 7.46"
                    fill="none"
                    stroke="currentColor"
                    strokeMiterlimit="10"
                  />
                </svg>
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default LinksView;