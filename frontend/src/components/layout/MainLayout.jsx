/**
 * Shared page shell — fixed header and footer with a flexible main area.
 * All routed pages render as {children} inside <main>.
 */
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}

export default MainLayout;
