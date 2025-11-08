

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero, type Slide } from './components/Hero';
import { ProductList } from './components/ProductList';
import { Footer } from './components/Footer';
import { ChatAssistant } from './components/ChatAssistant';
import type { Product, CartItem, CustomerDetails, BlogPost } from './types';
import { ToastNotification } from './components/ToastNotification';
import { OrderModal, type OrderDetails } from './components/OrderModal';
import { Checkout } from './components/Checkout';
import { AboutModal } from './components/AboutModal';
import { OrderConfirmation } from './components/OrderConfirmation';
import { BlogList } from './components/BlogList';
import { BlogPostPage } from './components/BlogPostPage';
import { FeaturedProducts } from './components/FeaturedProducts';
import { ProductDetailPage } from './components/ProductDetailPage';

// Mock product data
const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Jabón Antibacterial', brand: 'Sanar', category: 'Cuidado Personal', price: 4.50, originalPrice: 5.50, isOnSale: true, images: ['https://picsum.photos/seed/jabon/600/600', 'https://picsum.photos/seed/jabon2/600/600'], description: 'Elimina el 99.9% de las bacterias. Ideal para manos y cuerpo.', detailedDescription: 'Este jabón antibacterial está formulado con agentes limpiadores suaves y un potente componente antibacterial que protege tu piel mientras la limpia. Es perfecto para el uso diario de toda la familia, dejando una sensación de frescura y limpieza duradera.\n\n**Modo de Uso:** Humedecer la piel, aplicar el jabón hasta crear espuma y enjuagar con abundante agua.\n**Ingredientes:** Cloruro de benzalconio, Glicerina, Agua, Perfume.', reviews: [{rating: 4.5, author: 'Ana Pérez', date: '01/07/2024', comment: 'Excelente producto, no reseca la piel y tiene un aroma agradable.'}] },
  { id: 2, name: 'Acetaminofén 500mg', brand: 'FarmaCo', category: 'Medicamentos', price: 8.00, images: ['https://picsum.photos/seed/acetaminofen/600/600'], description: 'Alivio rápido y efectivo del dolor y la fiebre. Caja por 20 tabletas.', detailedDescription: 'Analgésico y antipirético indicado para el alivio sintomático de dolores ocasionales leves o moderados, como dolores de cabeza, dentales, musculares y para estados febriles.\n\n**Modo de Uso:** Adultos y niños mayores de 12 años: 1 tableta cada 4-6 horas. No exceder 8 tabletas en 24 horas.\n**Ingredientes Activos:** Acetaminofén 500mg.', reviews: [{rating: 5, author: 'Carlos Diaz', date: '03/07/2024', comment: 'Siempre confiable para el dolor de cabeza. Actúa rápido.'}] },
  { id: 3, name: 'Limpiador Multiusos Lavanda', brand: 'HogarLimpio', category: 'Aseo Hogar', price: 12.75, images: ['https://picsum.photos/seed/limpiador/600/600', 'https://picsum.photos/seed/limpiador2/600/600', 'https://picsum.photos/seed/limpiador3/600/600'], description: 'Aroma fresco y duradero. Limpia y desinfecta todas las superficies.', detailedDescription: 'Su poderosa fórmula corta la grasa y elimina la suciedad, dejando un brillo impecable y un relajante aroma a lavanda. Ideal para pisos, cocinas, baños y más.\n\n**Modo de Uso:** Diluir 1/4 de taza en 5 litros de agua para limpieza de pisos. Para superficies, aplicar directamente con un paño húmedo.\n**Ingredientes:** Agua, tensoactivos, fragancia, colorante.', reviews: [{rating: 4, author: 'Lucia Morales', date: '05/07/2024', comment: 'El olor es delicioso y limpia muy bien. Lo recomiendo.'}]},
  { id: 4, name: 'Crema Hidratante Facial', brand: 'PielSana', category: 'Cuidado Personal', price: 21.99, originalPrice: 25.00, isOnSale: true, images: ['https://picsum.photos/seed/crema/600/600'], description: 'Hidratación profunda por 24 horas. Para todo tipo de piel.', detailedDescription: 'Fórmula ligera y no grasa enriquecida con ácido hialurónico y vitamina E que restaura la barrera de hidratación de la piel, dejándola suave, tersa y radiante.\n\n**Modo de Uso:** Aplicar sobre el rostro y cuello limpios, mañana y noche.\n**Ingredientes:** Ácido Hialurónico, Vitamina E, Glicerina, Agua.', reviews: [] },
  { id: 5, name: 'Vitamina C Efervescente', brand: 'VitaPlus', category: 'Vitaminas', price: 15.20, images: ['https://picsum.photos/seed/vitamina/600/600', 'https://picsum.photos/seed/vitamina2/600/600'], description: 'Refuerza tu sistema inmune. Delicioso sabor a naranja.', detailedDescription: 'Suplemento dietario que contribuye al funcionamiento normal del sistema inmunitario y a la protección de las células frente al daño oxidativo. Cada tableta contiene 1000mg de Vitamina C.\n\n**Modo de Uso:** Disolver una tableta en un vaso de agua una vez al día.\n**Ingredientes:** Ácido ascórbico, ácido cítrico, bicarbonato de sodio.', reviews: [{rating: 5, author: 'Jorge Ramos', date: '02/07/2024', comment: 'Me encanta el sabor y me ayuda a no resfriarme.'}]},
  { id: 6, name: 'Detergente Líquido Ropa', brand: 'LavaMax', category: 'Aseo Hogar', price: 15.00, originalPrice: 18.50, isOnSale: true, images: ['https://picsum.photos/seed/detergente/600/600'], description: 'Poder quitamanchas y cuidado para tus prendas. Rinde 50 lavadas.', detailedDescription: 'Detergente líquido concentrado que penetra profundamente en las fibras para remover las manchas más difíciles, cuidando los colores de tu ropa. Apto para lavadoras de alta eficiencia.\n\n**Modo de Uso:** Usar una tapa para cargas normales. Para manchas difíciles, aplicar directamente sobre la mancha antes de lavar.\n**Ingredientes:** Tensoactivos aniónicos, enzimas, abrillantadores ópticos, perfume.', reviews: [{rating: 4.5, author: 'Maria F.', date: '04/07/2024', comment: 'Quita bien las manchas y la ropa queda oliendo rico.'}]},
  { id: 7, name: 'Protector Solar SPF 50', brand: 'SolCare', category: 'Cuidado Personal', price: 24.50, originalPrice: 30.00, isOnSale: true, images: ['https://picsum.photos/seed/protector/600/600', 'https://picsum.photos/seed/protector2/600/600'], description: 'Alta protección contra rayos UVA/UVB. Resistente al agua.', detailedDescription: 'Protector solar de amplio espectro con una textura ligera y de rápida absorción que no deja residuos blancos. Hipoalergénico y dermatológicamente probado.\n\n**Modo de Uso:** Aplicar generosamente 15 minutos antes de la exposición al sol. Reaplicar cada 2 horas.\n**Ingredientes Activos:** Avobenzona, Octocrileno, Octisalato.', reviews: [{rating: 5, author: 'Sofia Castro', date: '29/06/2024', comment: 'No es grasoso y protege súper bien. Es mi favorito.'}]},
  { id: 8, name: 'Ibuprofeno 400mg', brand: 'Genérico', category: 'Medicamentos', price: 9.50, images: ['https://picsum.photos/seed/ibuprofeno/600/600'], description: 'Eficaz contra el dolor muscular, de cabeza y menstrual.', detailedDescription: 'Antiinflamatorio no esteroideo (AINE) indicado para el alivio del dolor leve a moderado y la reducción de la fiebre. Actúa rápidamente para aliviar el malestar.\n\n**Modo de Uso:** Adultos: 1 cápsula cada 6-8 horas. No exceder 3 cápsulas en 24 horas.\n**Ingredientes Activos:** Ibuprofeno 400mg.', reviews: []},
  { id: 9, name: 'Pañuelos Desechables', brand: 'Suavitel', category: 'Cuidado Personal', price: 4.00, images: ['https://picsum.photos/seed/panuelos/600/600'], description: 'Suavidad y resistencia en cada pañuelo. Paquete triple.', detailedDescription: 'Pañuelos de triple hoja con un toque de aloe y vitamina E para una suavidad extra que cuida tu piel, incluso con el uso frecuente. Ideal para resfriados o alergias.\n\n**Material:** Celulosa virgen, aloe, vitamina E.', reviews: []},
  { id: 10, name: 'Desinfectante de Superficies', brand: 'HogarLimpio', category: 'Aseo Hogar', price: 10.00, images: ['https://picsum.photos/seed/desinfectante/600/600'], description: 'Elimina gérmenes y virus. Seguro para usar en toda la casa.', detailedDescription: 'Potente desinfectante en aerosol que elimina el 99.9% de virus, bacterias y hongos en superficies duras y no porosas. Sin cloro y con un aroma fresco y limpio.\n\n**Modo de Uso:** Rociar sobre la superficie a una distancia de 15-20 cm y dejar actuar por 5 minutos. No necesita enjuague.\n**Ingredientes Activos:** Amonio cuaternario.', reviews: [{rating: 5, author: 'Familia Gomez', date: '01/07/2024', comment: 'Indispensable en casa, sobre todo en temporada de gripe.'}]},
  { id: 11, name: 'Shampoo Revitalizante', brand: 'Capilux', category: 'Cuidado Personal', price: 22.00, images: ['https://picsum.photos/seed/shampoo/600/600', 'https://picsum.photos/seed/shampoo2/600/600'], description: 'Cabello más fuerte y brillante desde la primera lavada.', detailedDescription: 'Formulado con biotina y colágeno, este shampoo ayuda a fortalecer la fibra capilar desde la raíz, aportando volumen y un brillo saludable a tu cabello.\n\n**Modo de Uso:** Aplicar sobre el cabello húmedo, masajear hasta crear espuma y enjuagar bien.\n**Ingredientes:** Biotina, Colágeno, Proteína de trigo hidrolizada.', reviews: []},
  { id: 12, name: 'Loratadina Antialérgico', brand: 'Alerfin', category: 'Medicamentos', price: 11.00, images: ['https://picsum.photos/seed/loratadina/600/600'], description: 'Alivio de los síntomas de la alergia por 24 horas sin dar sueño.', detailedDescription: 'Antihistamínico de segunda generación que alivia eficazmente los síntomas de la rinitis alérgica como estornudos, secreción nasal, picazón en nariz y ojos. Su fórmula no produce somnolencia.\n\n**Modo de Uso:** Adultos y niños mayores de 6 años: 1 tableta una vez al día.\n**Ingredientes Activos:** Loratadina 10mg.', reviews: []},
];

const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: '5 Tips para Desinfectar tu Hogar en Temporada de Gripe',
    category: 'Limpieza',
    imageUrl: 'https://images.unsplash.com/photo-1583947215252-92e8b93595a8?q=80&w=2070&auto=format&fit=crop',
    excerpt: 'Mantén a tu familia protegida contra virus y bacterias con estos sencillos pero efectivos consejos de limpieza para las épocas de mayor riesgo.',
    content: `La temporada de gripe exige precauciones adicionales para mantener un ambiente saludable en casa. Aquí te compartimos 5 consejos clave:

1.  **Enfócate en los puntos de contacto:** Limpia y desinfecta diariamente superficies que se tocan con frecuencia: manijas de puertas, interruptores de luz, controles remotos, teléfonos y grifos. Un buen **Desinfectante de Superficies** es tu mejor aliado.

2.  **Ventila tu hogar:** Abrir las ventanas durante 10-15 minutos al día ayuda a renovar el aire y a reducir la concentración de gérmenes en el ambiente.

3.  **Lava la ropa de cama y toallas con más frecuencia:** Usa agua caliente y un **Detergente Líquido** eficaz para eliminar cualquier virus que pueda haberse alojado en los tejidos.

4.  **No olvides los aparatos electrónicos:** Usa toallitas desinfectantes especiales para limpiar teclados, ratones y pantallas de celulares, donde los gérmenes pueden acumularse fácilmente.

5.  **Promueve el lavado de manos constante:** Asegúrate de que todos en casa se laven las manos regularmente con un **Jabón Antibacterial**. Coloca jabón en todos los baños y en la cocina para facilitar este hábito crucial.`,
    author: 'Dra. Elena Rivas',
    date: '15 de Julio, 2024',
  },
  {
    id: 2,
    title: 'Los Increíbles Beneficios de la Vitamina C para tu Sistema Inmune',
    category: 'Salud',
    imageUrl: 'https://images.unsplash.com/photo-1607619056574-7d8d3ee536b2?q=80&w=1910&auto=format&fit=crop',
    excerpt: 'Descubre por qué la Vitamina C es un nutriente esencial para fortalecer tus defensas y cómo puedes incorporarla fácilmente en tu rutina diaria.',
    content: `La Vitamina C, o ácido ascórbico, es uno de los antioxidantes más potentes y un pilar fundamental para un sistema inmunológico fuerte. Aquí te explicamos sus beneficios:

- **Fortalece las defensas:** La Vitamina C estimula la producción y función de los glóbulos blancos, que son las células encargadas de combatir infecciones en nuestro cuerpo.

- **Poderoso antioxidante:** Protege a las células del cuerpo del daño causado por los radicales libres, moléculas que pueden contribuir al envejecimiento y a diversas enfermedades.

- **Mejora la absorción de hierro:** Ayuda a que tu cuerpo absorba mejor el hierro de los alimentos de origen vegetal, previniendo la anemia.

- **Esencial para la piel:** Es crucial para la producción de colágeno, una proteína que ayuda a mantener la piel, los huesos y los vasos sanguíneos saludables.

Una forma práctica y deliciosa de asegurar tu dosis diaria es con una **Vitamina C Efervescente**. Disuelta en agua, es una bebida refrescante que te ayuda a mantenerte protegido desde adentro.`,
    author: 'Nut. Carlos Vega',
    date: '10 de Julio, 2024',
  },
  {
    id: 3,
    title: 'Guía Rápida para Aliviar el Dolor de Cabeza Común',
    category: 'Bienestar',
    imageUrl: 'https://images.unsplash.com/photo-1594910243403-d85b15a13b6c?q=80&w=1964&auto=format&fit=crop',
    excerpt: 'El dolor de cabeza puede arruinar tu día. Aprende a identificar sus causas comunes y descubre las formas más efectivas de encontrar alivio rápidamente.',
    content: `El dolor de cabeza tensional es uno de los malestares más comunes. Generalmente, es causado por estrés, fatiga visual, mala postura o deshidratación. Aquí tienes una guía rápida para aliviarlo:

1.  **Hidrátate:** A veces, un simple vaso de agua es suficiente para empezar a sentir alivio. La deshidratación es una causa frecuente de dolores de cabeza.

2.  **Descansa en un lugar tranquilo:** Apaga las luces, aléjate de las pantallas y recuéstate en un lugar silencioso por unos minutos. Esto puede reducir la tensión.

3.  **Aplica compresas frías o calientes:** Una compresa fría en la frente o una almohadilla caliente en la nuca pueden ayudar a relajar los músculos y aliviar el dolor.

4.  **Considera un analgésico de venta libre:** Para un alivio rápido y efectivo, medicamentos como el **Acetaminofén** o el **Ibuprofeno** son opciones seguras y confiables. Ayudan a reducir la inflamación y a bloquear las señales de dolor.

Recuerda que si los dolores de cabeza son frecuentes o muy intensos, es importante consultar a un médico para descartar otras causas.`,
    author: 'Dra. Ana Torres',
    date: '5 de Julio, 2024',
  }
];


/**
 * Calculates the Levenshtein distance between two strings.
 * This is a measure of the difference between two sequences.
 * Used for our fuzzy search implementation.
 */
const levenshteinDistance = (a: string, b: string): number => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
};


// New Cart Page Component
interface CartPageProps {
  cartItems: CartItem[];
  products: Product[];
  onUpdateQuantity: (productId: number, newQuantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
  onBackToProducts: () => void;
}

const CartPage: React.FC<CartPageProps> = ({ cartItems, products, onUpdateQuantity, onRemoveItem, onCheckout, onBackToProducts }) => {
  const cartDetails = useMemo(() => {
    return cartItems.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        productName: product?.name || 'Producto no encontrado',
        price: product?.price || 0,
        imageUrl: product?.images[0] || '',
      };
    }).sort((a, b) => a.productName.localeCompare(b.productName));
  }, [cartItems, products]);

  const total = useMemo(() => {
    return cartDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartDetails]);

  if (cartDetails.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="bg-neutral-card p-8 sm:p-12 rounded-xl shadow-lg max-w-2xl mx-auto border border-slate-200/50">
            <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            </div>
            <h1 className="mt-6 text-3xl font-bold text-neutral-text">Tu bolsa de compras está vacía</h1>
            <p className="mt-3 text-lg text-neutral-subtle max-w-md mx-auto">
            ¡No te preocupes! Echa un vistazo a nuestros increíbles productos y encuentra algo que te encante.
            </p>
            <button onClick={onBackToProducts} className="mt-8 inline-flex items-center gap-2 bg-neutral-accent text-white font-bold py-3 px-8 rounded-full hover:bg-neutral-accent-hover transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
            Explorar Productos
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center mb-8">
            <button onClick={onBackToProducts} className="text-neutral-accent hover:underline flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Seguir Comprando
            </button>
        </div>
        <h1 className="text-3xl font-bold text-neutral-text mb-8 text-center">Mi Carrito de Compras</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-neutral-card p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200/50">
                <h2 className="text-2xl font-bold text-neutral-text mb-6">Tus Productos</h2>
                <ul className="divide-y divide-slate-200">
                    {cartDetails.map(item => (
                        <li key={item.productId} className="flex flex-col sm:flex-row items-center py-6 gap-6">
                            <img src={item.imageUrl} alt={item.productName} className="w-28 h-28 rounded-lg object-cover flex-shrink-0 border border-slate-200" />
                            <div className="flex-grow text-center sm:text-left">
                                <p className="text-lg font-bold text-neutral-text">{item.productName}</p>
                                <p className="text-sm text-neutral-subtle mt-1">${item.price.toFixed(2)} c/u</p>
                                <button onClick={() => onRemoveItem(item.productId)} aria-label="Eliminar producto" className="mt-2 text-sm text-red-500 hover:underline inline-flex items-center gap-1 sm:hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                                    Eliminar
                                </button>
                            </div>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <button onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)} className="h-10 w-10 text-xl font-light bg-slate-100 rounded-full hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-accent">-</button>
                                <span className="w-10 text-center font-bold text-lg">{item.quantity}</span>
                                <button onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)} className="h-10 w-10 text-xl font-light bg-slate-100 rounded-full hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-accent">+</button>
                            </div>
                            <p className="font-bold text-lg w-24 text-center text-neutral-accent">${(item.price * item.quantity).toFixed(2)}</p>
                            <button onClick={() => onRemoveItem(item.productId)} aria-label="Eliminar producto" className="text-neutral-subtle hover:text-red-500 hidden sm:block p-2 rounded-full hover:bg-red-50 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="lg:col-span-1">
                <div className="bg-neutral-card p-6 sm:p-8 rounded-xl shadow-lg border border-slate-200/50 sticky top-28">
                    <h2 className="text-2xl font-bold mb-6 border-b border-slate-200 pb-4">Resumen del Pedido</h2>
                    <div className="space-y-3 mb-6 text-lg">
                        <div className="flex justify-between text-neutral-subtle">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-neutral-subtle">
                            <span>Envío</span>
                            <span className="text-neutral-text font-semibold">A coordinar</span>
                        </div>
                    </div>
                     <div className="bg-slate-50 -mx-6 sm:-mx-8 p-6 sm:p-8 mt-6 rounded-b-xl">
                        <div className="flex justify-between items-center text-lg font-bold border-t border-slate-200 pt-6">
                            <span className="text-2xl">Total</span>
                            <span className="text-3xl text-neutral-accent">${total.toFixed(2)}</span>
                        </div>
                        <button onClick={onCheckout} className="mt-6 w-full flex items-center justify-center gap-2 bg-neutral-accent text-white font-bold py-4 px-6 rounded-xl hover:bg-neutral-accent-hover transition-all transform hover:scale-105 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-neutral-accent">
                            Ir a Pagar
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export interface ConfirmedOrder {
  customerDetails: CustomerDetails;
  cartItems: CartItem[];
  products: Product[];
  total: number;
}


const App: React.FC = () => {
  const [view, setView] = useState<'products' | 'cart' | 'checkout' | 'confirmation' | 'blogList' | 'blogPost' | 'productDetail'>('products');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState({ message: '', show: false });
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [productToOrder, setProductToOrder] = useState<Product | null>(null);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const notificationTimer = useRef<number | null>(null);
  const filterTimeoutRef = useRef<number | null>(null);
  
  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // Data for carousels
  const bestsellingProducts = useMemo(() => 
      [...MOCK_PRODUCTS].sort(() => 0.5 - Math.random()).slice(0, 8), 
      []
  );
  const newArrivals = useMemo(() => 
      [...MOCK_PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 8),
      []
  );
  const onSaleProducts = useMemo(() =>
      MOCK_PRODUCTS.filter(p => p.isOnSale),
      []
  );

  const showNotification = (message: string) => {
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }
    setNotification({ message, show: true });
    notificationTimer.current = window.setTimeout(() => {
      setNotification({ message: '', show: false });
      notificationTimer.current = null;
    }, 3000);
  };

  const handleToggleFavorite = (productId: number) => {
    setFavoriteIds(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
        // If the user un-favorites the last item while in the "Favoritos" category, switch back to "Todos"
        if (newFavorites.size === 0 && selectedCategory === 'Favoritos') {
          setSelectedCategory('Todos');
        }
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleAddToCart = (product: Product) => {
    setProductToOrder(product);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrderModal = () => {
    setIsOrderModalOpen(false);
    setProductToOrder(null);
  };

  const handleConfirmAddToCart = (orderDetails: OrderDetails) => {
    const product = MOCK_PRODUCTS.find(p => p.name === orderDetails.productName);
    if (!product) return;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === product.id);

      if (existingItemIndex > -1) {
        // Product exists, update quantity
        const newCart = [...prevCart];
        const existingItem = newCart[existingItemIndex];
        newCart[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + orderDetails.quantity,
        };
        return newCart;
      } else {
        // Product doesn't exist, add it
        return [...prevCart, { productId: product.id, quantity: orderDetails.quantity }];
      }
    });

    showNotification(`${orderDetails.quantity}x ${orderDetails.productName} agregado al carrito.`);
    handleCloseOrderModal();
  };
  
  const handleSwitchProductInModal = (newProduct: Product) => {
    setProductToOrder(newProduct);
  };

  const handleAddToCartFromDetail = (product: Product, quantity: number) => {
     setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.productId === product.id);
      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        const existingItem = newCart[existingItemIndex];
        newCart[existingItemIndex] = { ...existingItem, quantity: existingItem.quantity + quantity };
        return newCart;
      } else {
        return [...prevCart, { productId: product.id, quantity }];
      }
    });
    showNotification(`${quantity}x ${product.name} agregado al carrito.`);
  };
  
  const handleGoToCart = () => {
    setView('cart');
    window.scrollTo(0, 0);
  };

  const handleGoToCheckout = () => {
    setView('checkout');
    window.scrollTo(0, 0);
  };
  
  const handleBackToProducts = () => {
    setView('products');
    setSelectedProduct(null); // Clear selected product when going back
    window.scrollTo(0, 0);
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number) => {
    setCart(currentCart => {
        if (newQuantity < 1) {
            return currentCart.filter(item => item.productId !== productId);
        }
        return currentCart.map(item => 
            item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
    });
  };

  const handleRemoveFromCart = (productId: number) => {
      setCart(currentCart => currentCart.filter(item => item.productId !== productId));
  };

  const handlePlaceOrder = (customerDetails: CustomerDetails) => {
      const total = cart.reduce((sum, item) => {
        const product = MOCK_PRODUCTS.find(p => p.id === item.productId);
        return sum + (product?.price || 0) * item.quantity;
      }, 0);

      setConfirmedOrder({
        customerDetails,
        cartItems: [...cart],
        products: MOCK_PRODUCTS,
        total,
      });

      setView('confirmation');
      setCart([]);
      window.scrollTo(0, 0);
  };
  
  const handleBackToStoreFromConfirmation = () => {
    setView('products');
    setConfirmedOrder(null);
  }
  
  const handleGoHome = () => {
    setView('products');
    setSearchQuery('');
    setSelectedCategory('Todos');
    window.scrollTo(0, 0);
  };

  const handleGoToBlogList = () => {
    setView('blogList');
    window.scrollTo(0, 0);
  };

  const handleViewBlogPost = (post: BlogPost) => {
    setSelectedPost(post);
    setView('blogPost');
    window.scrollTo(0, 0);
  };
  
  const handleBackToBlogList = () => {
    setSelectedPost(null);
    setView('blogList');
    window.scrollTo(0, 0);
  }
  
  const handleHeaderCategorySelection = (category: string) => {
    setView('products');
    setSelectedCategory(category);
    setTimeout(() => {
        document.getElementById('product-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const handleViewProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setView('productDetail');
    window.scrollTo(0, 0);
  };

  const handleGoToOffers = () => {
    setView('products');
    setSelectedCategory('Ofertas');
    setTimeout(() => {
        document.getElementById('product-list-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  };

  const HERO_SLIDES: Slide[] = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1512428209355-e824653f56d8?q=80&w=2070&auto=format&fit=crop',
      title: 'Descuentos Especiales en Cuidado Personal',
      subtitle: 'Aprovecha hasta un 25% de descuento en tus marcas favoritas de cuidado facial y corporal.',
      ctaText: 'Ver Ofertas',
      ctaAction: handleGoToOffers,
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?q=80&w=2070&auto=format&fit=crop',
      title: 'Todo para un Hogar Impecable',
      subtitle: 'Encuentra los mejores productos de limpieza para mantener cada rincón de tu casa reluciente.',
      ctaText: 'Explorar Limpieza',
      ctaAction: () => handleHeaderCategorySelection('Aseo Hogar'),
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop',
      title: 'Bienestar y Salud a tu Alcance',
      subtitle: 'Descubre nuestra completa sección de medicamentos y vitaminas para cuidar de ti y tu familia.',
      ctaText: 'Ver Medicamentos',
      ctaAction: () => handleHeaderCategorySelection('Medicamentos'),
    },
  ];


  const categories = useMemo(() => {
    const productCats = [...new Set(MOCK_PRODUCTS.map(p => p.category))].sort();
    let baseCategories = ['Todos', ...productCats];
    
    if (MOCK_PRODUCTS.some(p => p.isOnSale)) {
      baseCategories.splice(1, 0, 'Ofertas'); // Insert 'Ofertas' after 'Todos'
    }

    if (favoriteIds.size > 0) {
      return ['Favoritos', ...baseCategories];
    }
    return baseCategories;
  }, [favoriteIds.size]);

  const productCategories = useMemo(() => 
    [...new Set(MOCK_PRODUCTS.map(p => p.category))].sort(), 
    []
  );

  useEffect(() => {
    if (view !== 'products') return;

    setIsLoading(true);

    if (filterTimeoutRef.current) {
      clearTimeout(filterTimeoutRef.current);
    }

    filterTimeoutRef.current = window.setTimeout(() => {
      let products: Product[];

      if (selectedCategory === 'Favoritos') {
        products = MOCK_PRODUCTS.filter(p => favoriteIds.has(p.id));
      } else if (selectedCategory === 'Ofertas') {
        products = MOCK_PRODUCTS.filter(p => p.isOnSale);
      } else if (selectedCategory !== 'Todos') {
        products = MOCK_PRODUCTS.filter(p => p.category === selectedCategory);
      } else {
        products = MOCK_PRODUCTS;
      }
      
      const normalize = (str: string) => str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const trimmedQuery = normalize(searchQuery.trim());

      if (trimmedQuery === '') {
        setFilteredProducts(products);
        setIsLoading(false);
        return;
      }
      
      const queryWords = trimmedQuery.split(/\s+/).filter(Boolean);

      const newlyFiltered = products.filter(p => {
        const productName = normalize(p.name);
        
        // Case 1: The whole query is a substring of the product name (fast path, exact match).
        if (productName.includes(trimmedQuery)) {
          return true;
        }

        // Case 2: Fuzzy match word by word. All query words must be "close" to words in the product name.
        const productNameWords = productName.split(/\s+/).filter(Boolean);
        
        return queryWords.every(queryWord => {
          return productNameWords.some(productWord => {
            // Check if the query word is a substring of the product word
            if (productWord.includes(queryWord)) {
              return true;
            }
            // If not, check the Levenshtein distance for typos.
            // Allow more typos for longer words.
            const threshold = queryWord.length > 4 ? 2 : 1;
            if (levenshteinDistance(productWord, queryWord) <= threshold) {
              return true;
            }
            return false;
          });
        });
      });
      setFilteredProducts(newlyFiltered);
      setIsLoading(false);
    }, 300);

    return () => {
      if (filterTimeoutRef.current) {
        clearTimeout(filterTimeoutRef.current);
      }
    };
  }, [selectedCategory, searchQuery, favoriteIds, view]);
  
  const renderContent = () => {
    switch (view) {
        case 'products':
            return (
                <>
                    <div className="bg-neutral-secondary text-white text-center py-2 px-4 text-sm sm:text-base animate-pop-in-up">
                      <p className="inline-flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 hidden sm:inline" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v5.05a2.5 2.5 0 014.9 0H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                        </svg>
                        <strong>¡Envío Gratis en Pedidos Superiores a $100.000!</strong> Aprovecha y llena tu carrito.
                      </p>
                    </div>
                    <Hero slides={HERO_SLIDES} />
                    <FeaturedProducts
                        title="Los Más Vendidos"
                        products={bestsellingProducts}
                        onAddToCart={handleAddToCart}
                        favoriteIds={favoriteIds}
                        onToggleFavorite={handleToggleFavorite}
                        onViewProductDetail={handleViewProductDetail}
                    />
                    <FeaturedProducts
                        title="Novedades"
                        products={newArrivals}
                        onAddToCart={handleAddToCart}
                        favoriteIds={favoriteIds}
                        onToggleFavorite={handleToggleFavorite}
                        onViewProductDetail={handleViewProductDetail}
                    />
                    {onSaleProducts.length > 0 && (
                        <FeaturedProducts
                            title="Ofertas Especiales"
                            products={onSaleProducts}
                            onAddToCart={handleAddToCart}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={handleToggleFavorite}
                            onViewProductDetail={handleViewProductDetail}
                        />
                    )}
                    <div id="product-list-section">
                        <ProductList 
                            products={filteredProducts} 
                            categories={categories}
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                            onAddToCart={handleAddToCart}
                            favoriteIds={favoriteIds}
                            onToggleFavorite={handleToggleFavorite}
                            isLoading={isLoading}
                            onViewProductDetail={handleViewProductDetail}
                        />
                    </div>
                </>
            );
        case 'cart':
            return (
                <CartPage
                    cartItems={cart}
                    products={MOCK_PRODUCTS}
                    onUpdateQuantity={handleUpdateCartQuantity}
                    onRemoveItem={handleRemoveFromCart}
                    onCheckout={handleGoToCheckout}
                    onBackToProducts={handleBackToProducts}
                />
            );
        case 'checkout':
            return (
                <Checkout
                    cartItems={cart}
                    products={MOCK_PRODUCTS}
                    onPlaceOrder={handlePlaceOrder}
                    onBack={handleGoToCart}
                />
            );
        case 'confirmation':
            return (
                <OrderConfirmation 
                    order={confirmedOrder}
                    onBackToStore={handleBackToStoreFromConfirmation}
                />
            );
        case 'blogList':
            return <BlogList posts={MOCK_BLOG_POSTS} onViewPost={handleViewBlogPost} />;
        case 'blogPost':
            return selectedPost ? <BlogPostPage post={selectedPost} onBack={handleBackToBlogList} /> : <BlogList posts={MOCK_BLOG_POSTS} onViewPost={handleViewBlogPost} />;
        case 'productDetail':
            return selectedProduct ? (
                <ProductDetailPage 
                    product={selectedProduct} 
                    onBack={handleBackToProducts}
                    onAddToCart={handleAddToCartFromDetail}
                />
            ) : <></>; // Or a not found page
        default:
             return <></>;
    }
  }


  return (
    <div className="flex flex-col min-h-screen font-sans">
      <Header 
        cartCount={cartCount} 
        searchQuery={searchQuery}
        onSearchChange={(query) => {
          setSearchQuery(query);
          if (query) {
            setView('products');
          }
        }}
        onProductSuggestionClick={(product) => {
          handleViewProductDetail(product);
          setSearchQuery(''); // Reset search query
        }}
        allProducts={MOCK_PRODUCTS}
        onSelectCategory={handleHeaderCategorySelection}
        productCategories={productCategories}
        onCartClick={handleGoToCart}
        onAboutClick={() => setIsAboutModalOpen(true)}
        onBlogClick={handleGoToBlogList}
        onHomeClick={handleGoHome}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <a
        href="https://wa.me/qr/IRPOT652PECWO1"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 bg-[#25D366] text-white rounded-full p-4 shadow-lg hover:bg-[#128C7E] transition-transform transform hover:scale-110 z-50 animate-whatsapp-pulse"
        aria-label="Contactar por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.651 4.39 1.88 6.166l-1.29 4.721 4.793-1.262zM12.067 10.808c-.271-.136-.972-.48-.972-.48s-.525-.188-.732.188c-.207.376-.767.936-.935 1.103-.168.169-.336.188-.605.052-.27-.136-1.146-.416-2.181-1.344-.805-.712-1.347-1.588-1.515-1.856-.168-.267-.031-.412.117-.539.141-.129.27-.188.406-.27.135-.082.188-.135.27-.223.082-.088.052-.168-.024-.304s-.732-1.763-.98-2.403c-.247-.621-.494-.539-.687-.539-.187 0-.405-.023-.605-.023-.2 0-.525.08-.787.376-.262.296-.995.972-.995 2.392 0 1.42 1.023 2.775 1.17 2.973.147.198 1.995 3.2 4.833 4.252.68.253 1.217.405 1.63.518.75.198 1.442.168 1.995-.082.593-.28 1.763-1.023 2.013-1.39.25-.366.25-.687.168-.822-.082-.136-.27-.223-.552-.376z"/>
        </svg>
      </a>
      <ChatAssistant products={MOCK_PRODUCTS} />
      <Footer />
      <ToastNotification message={notification.message} show={notification.show} />
      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrderModal}
        product={productToOrder}
        allProducts={MOCK_PRODUCTS}
        onProductSwitch={handleSwitchProductInModal}
        onSubmit={handleConfirmAddToCart}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};

export default App;