const Footer = () => (
  <footer className="h-10 border-t border-border bg-card/50 flex items-center justify-center px-4 shrink-0">
    <p className="text-[11px] text-muted-foreground">
      © {new Date().getFullYear()} ASTIOX Admin Panel
    </p>
  </footer>
);

export default Footer;
