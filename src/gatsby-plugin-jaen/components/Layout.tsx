import { LayoutProps } from 'jaen';
import { useLocation } from '@reach/router';
import { CMSManagement, useJaenFrameMenuContext } from 'gatsby-plugin-jaen';
import AppLayout from '../../components/AppLayout';
import { Footer } from '../../components/Everything';
import { ContactModalProvider } from '../../services/contact';
import { BookingModalProvider } from '../../services/booking';

const Layout: React.FC<LayoutProps> = ({ children, pageProps }) => {
  const path = useLocation().pathname;

  const docsPaths = ['/docs'];

  const jaenFrame = useJaenFrameMenuContext();

  // useEffect(() => {
  //   jaenFrame.extendAddMenu({
  //     experimentNew: {
  //       label: 'New experiment',
  //       icon: FaFlask,
  //       path: '/new/experiment'
  //     }
  //   });
  // }, []);

  const isDocs = docsPaths.some(docsPath => path.startsWith(docsPath));

  if (path.startsWith('/admin')) {
    return children;
  }

  return (
    <CMSManagement>
      <ContactModalProvider location={{ pathname: path, search: '' }}>
        <BookingModalProvider location={{ pathname: path, search: '' }}>
          <AppLayout footer={Footer} isDocs={isDocs} path={path}>
            {children}
          </AppLayout>
        </BookingModalProvider>
      </ContactModalProvider>
    </CMSManagement>
  );
};

export default Layout;
