import '@/styles/globals.css';
import '@/styles/styles.css';
import { BaseLayout } from '@/components';

export const metadata = {
  title: 'Duber Eats',
  description: 'Duber Eats is a food delivery service',
};

const RootLayout = ({
  children,
}: {
      children: React.ReactNode
    }) => (
      <html lang='en'>
        <body>
          <BaseLayout>
            {children}
          </BaseLayout>
        </body>
      </html>
);

export default RootLayout;
