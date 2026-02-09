import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Events from "@/components/Events";
import Gallery from "@/components/Gallery";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Container, Box } from "@mui/material";

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Container maxWidth="lg">
          <Box component="section" id="agenda" sx={{ py: { xs: 8, md: 12 } }}>
            <Events />
          </Box>
          <Box component="section" id="media" sx={{ py: { xs: 8, md: 12 } }}>
            <Gallery />
          </Box>
          <Box component="section" id="contacto" sx={{ py: { xs: 8, md: 12 } }}>
            <Contact />
          </Box>
        </Container>
      </main>
      <Footer />
    </>
  );
}
