# Mídia Kit - IONLAB

Plataforma de catálogo de produtos para a IONLAB. Organize e gerencie fotos, vídeos e manuais de equipamentos de forma simples e prática.

## Como usar

### Para acessar
Abra o site e navegue pelas seções:
- **Fotos**: Galeria de equipamentos
- **Vídeos**: Tutoriais e demonstrações
- **Manuais**: Documentos técnicos dos produtos
- **Contato**: Formulário de suporte

### Para admin/gerenciar
1. Faça login como administrador
2. Clique em **Gerenciar Fotos**, **Gerenciar Vídeos** ou **Gerenciar Manuais**
3. Você pode:
   - **Importar CSV** com vários produtos de uma vez
   - **Criar** novo item manualmente
   - **Editar** informações de um item
   - **Excluir** ou marcar como descontinuado

## Para desenvolvedores

**Pré-requisitos:**
- Node.js 16+

**Instalar e rodar:**
```bash
npm install
npm run dev
```

O projeto usa:
- React + TypeScript
- Firebase (hospedagem e banco de dados)
- Tailwind CSS (estilos)
- Vite (build)

## Deploy

O projeto é automaticamente publicado no Firebase Hosting.
