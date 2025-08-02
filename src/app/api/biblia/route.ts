// app/api/biblia/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Cache em memória para melhor performance
let bibliaCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hora

function carregarBiblia() {
  const now = Date.now();
  
  // Se tem cache válido, retorna
  if (bibliaCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return bibliaCache;
  }
  
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'nvi.json');
    
    if (!fs.existsSync(filePath)) {
      throw new Error('Arquivo da Bíblia não encontrado. Execute: node scripts/download-bible.js');
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Atualiza cache
    bibliaCache = data;
    cacheTimestamp = now;
    
    console.log(`📚 Bíblia carregada: ${Object.keys(data).length} livros`);
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao carregar Bíblia:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const livro = searchParams.get('livro');
    const capitulo = searchParams.get('capitulo');
    
    const biblia = carregarBiblia();
    
    // Rota para capítulo aleatório
    if (action === 'random') {
      const livros = Object.keys(biblia);
      const livroAleatorio = livros[Math.floor(Math.random() * livros.length)];
      const livroData = biblia[livroAleatorio];
      
      if (!livroData.capitulos || livroData.capitulos.length === 0) {
        throw new Error('Livro sem capítulos');
      }
      
      const capituloAleatorio = livroData.capitulos[Math.floor(Math.random() * livroData.capitulos.length)];
      
      return NextResponse.json({
        livro: livroAleatorio,
        nomeCompleto: livroData.nome,
        capitulo: capituloAleatorio.capitulo,
        versiculos: capituloAleatorio.versiculos
      });
    }
    
    // Rota para capítulo específico
    if (action === 'chapter' && livro && capitulo) {
      const livroData = biblia[livro];
      if (!livroData) {
        return NextResponse.json({ error: 'Livro não encontrado' }, { status: 404 });
      }
      
      const capituloData = livroData.capitulos.find((cap: any) => cap.capitulo === parseInt(capitulo));
      if (!capituloData) {
        return NextResponse.json({ error: 'Capítulo não encontrado' }, { status: 404 });
      }
      
      return NextResponse.json({
        livro,
        nomeCompleto: livroData.nome,
        capitulo: capituloData.capitulo,
        versiculos: capituloData.versiculos
      });
    }
    
    // Rota para listar livros
    if (action === 'books') {
      const livros = Object.entries(biblia).map(([codigo, data]: [string, any]) => ({
        codigo,
        nome: data.nome,
        capitulos: data.capitulos.length
      }));
      
      return NextResponse.json(livros);
    }
    
    // Rota para estatísticas
    if (action === 'stats') {
      const livros = Object.keys(biblia);
      let totalCapitulos = 0;
      let totalVersiculos = 0;
      
      Object.values(biblia).forEach((livro: any) => {
        totalCapitulos += livro.capitulos.length;
        livro.capitulos.forEach((cap: any) => {
          totalVersiculos += cap.versiculos.length;
        });
      });
      
      return NextResponse.json({
        livros: livros.length,
        capitulos: totalCapitulos,
        versiculos: totalVersiculos
      });
    }
    
    // Retorna todos os dados se nenhuma ação específica
    return NextResponse.json(biblia);
    
  } catch (error) {
    console.error('❌ Erro na API:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

// Headers para cache e performance
const headers = {
  'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  'Content-Type': 'application/json',
};