
'use client';

import React, { createContext, useContext, useState, useRef, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';

type PrintContextType = {
  print: (content: ReactNode) => void;
};

const PrintContext = createContext<PrintContextType | null>(null);

export const usePrint = () => {
  const context = useContext(PrintContext);
  if (!context) {
    throw new Error('usePrint must be used within a PrintProvider');
  }
  return context;
};

export const PrintProvider = ({ children }: { children: ReactNode }) => {
  const [printing, setPrinting] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const printWindowRef = useRef<Window | null>(null);

  const print = useCallback((contentToPrint: ReactNode) => {
    setContent(contentToPrint);
    setPrinting(true);
  }, []);
  
  const handlePrint = () => {
    if (printWindowRef.current) {
        printWindowRef.current.focus();
        printWindowRef.current.print();
        // The close is handled by onafterprint or by the user closing the tab
    }
  }

  const handleAfterPrint = () => {
     if (printWindowRef.current) {
        printWindowRef.current.close();
        printWindowRef.current = null;
        setPrinting(false);
        setContent(null);
    }
  }

  return (
    <PrintContext.Provider value={{ print }}>
      {children}
      {printing && (
         <PrintWindow onPrint={handlePrint} onAfterPrint={handleAfterPrint}>
            {content}
        </PrintWindow>
      )}
    </PrintContext.Provider>
  );
};


const PrintWindow = ({
  children,
  onPrint,
  onAfterPrint,
}: {
  children: ReactNode;
  onPrint: () => void;
  onAfterPrint: () => void;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const newWindow = useRef<Window | null>(window.open('', '_blank'));

  React.useEffect(() => {
    if (newWindow.current) {
      containerRef.current = newWindow.current.document.createElement('div');
      newWindow.current.document.body.appendChild(containerRef.current);
      
      // Copy styles from the main document to the new window
      const styleSheets = Array.from(document.styleSheets);
      styleSheets.forEach(styleSheet => {
        try {
          const cssRules = Array.from(styleSheet.cssRules);
           if (cssRules) {
                const style = newWindow.current?.document.createElement('style');
                if (style) {
                    style.appendChild(document.createTextNode(cssRules.map(rule => rule.cssText).join(' ')));
                    newWindow.current?.document.head.appendChild(style);
                }
            }
        } catch (e) {
            console.warn('Cannot access stylesheet:', e)
        }
      });
      
      newWindow.current.addEventListener('load', onPrint);
      newWindow.current.addEventListener('afterprint', onAfterPrint);
      
      return () => {
        newWindow.current?.removeEventListener('load', onPrint);
        newWindow.current?.removeEventListener('afterprint', onAfterPrint);
        if (!newWindow.current?.closed) {
          newWindow.current?.close();
        }
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef.current ? createPortal(children, containerRef.current) : null;
};

// This is the default page content, which will not be rendered
// as we are using this page as a context provider.
export default function PrintPage() {
  return null;
}
