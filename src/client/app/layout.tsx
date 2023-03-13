
import '@styles/globals.css';
import { BaseLayout } from '@components';

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
        <BaseLayout>
          <body>{children}</body>
        </BaseLayout>
      </html>
);

export default RootLayout;
