import { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import About from './components/About';
import LocationFooter from './components/LocationFooter';
import CartDrawer from './components/CartDrawer';
import CartBar from './components/CartBar';
import { useCart } from './hooks/useCart';
import { useTheme } from './hooks/useTheme';

/**
 * App composition — owns theme, cart state, drawer visibility.
 * Landmarks: pill nav → <main id=conteudo> → dark <footer>.
 * Light default (porcelain); obsidian via header toggle, persisted.
 */
export default function App() {
  const cart = useCart();
  const { theme, toggle } = useTheme();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Header
        cartCount={cart.count}
        cartTotal={cart.totalCents}
        onOpenCart={() => setCartOpen(true)}
        theme={theme}
        onToggleTheme={toggle}
      />
      <main id="conteudo">
        <Hero />
        <MenuSection cart={cart} />
        <About />
      </main>
      <LocationFooter />

      <CartBar
        count={cart.count}
        totalCents={cart.totalCents}
        hidden={cartOpen}
        onOpen={() => setCartOpen(true)}
      />
      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
