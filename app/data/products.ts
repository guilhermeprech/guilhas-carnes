export type Product = {
    id: string;
    name: string;
    description: string;
    price: number; // em reais
    category: string;
  };
  
  export const products: Product[] = [
    {
      id: "p1",
      name: "Picanha Premium",
      description: "Corte macio, ideal para churrasco.",
      price: 129.9,
      category: "Bovinos",
    },
    {
      id: "p2",
      name: "Costela Bovina",
      description: "Perfeita para fogo de chão.",
      price: 89.9,
      category: "Bovinos",
    },
    {
      id: "p3",
      name: "Alcatra",
      description: "Ótima para bifes e churrasco.",
      price: 79.9,
      category: "Bovinos",
    },
    {
      id: "p4",
      name: "Linguiça Toscana",
      description: "Tradicional, suculenta e bem temperada.",
      price: 24.9,
      category: "Linguiças",
    },
    {
      id: "p5",
      name: "Fraldinha",
      description: "Corte com sabor marcante.",
      price: 74.9,
      category: "Bovinos",
    },
    {
      id: "p6",
      name: "Kit Churrasco (Unidades)",
      description: "Seleção de carnes para o final de semana.",
      price: 199.9,
      category: "Kits",
    },
  ];