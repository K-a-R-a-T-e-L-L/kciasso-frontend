import Header from "@/widgets/layout/Header/Header";
import Footer from "@/widgets/layout/Footer/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
