
// This is the layout specifically for the print page.
// It should contain minimal styling and structure.
export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bg">
        <head>
            <style>{`
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    @page {
                        size: A4;
                        margin: 2cm;
                    }
                }
            `}</style>
        </head>
      <body>
        {children}
      </body>
    </html>
  );
}
