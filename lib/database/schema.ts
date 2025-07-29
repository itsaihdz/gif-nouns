// Mock Database Schema for Nouns Remix Studio
// In a real implementation, this would be a proper database schema

export interface User {
  id: string;
  walletAddress: string;
  farcasterId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadedFile {
  id: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  ipfsHash?: string;
  uploadedAt: Date;
}

export interface NounTraits {
  id: string;
  fileId: string;
  eyes: string;
  noggles: string;
  background: string;
  body: string;
  head: string;
  glasses?: string;
  hat?: string;
  shirt?: string;
  confidence: number;
  detectedAt: Date;
}

export interface GeneratedGif {
  id: string;
  fileId: string;
  userId: string;
  originalTraitsId: string;
  noggleColor: string;
  eyeAnimation: string;
  gifUrl: string;
  ipfsHash?: string;
  metadata: {
    width: number;
    height: number;
    frameCount: number;
    duration: number;
    fileSize: number;
  };
  generatedAt: Date;
}

export interface NftMint {
  id: string;
  gifId: string;
  userId: string;
  tokenId: string;
  contractAddress: string;
  transactionHash: string;
  mintedAt: Date;
}

export interface Remix {
  id: string;
  originalGifId: string;
  remixedGifId: string;
  remixerId: string;
  attributionChain: string[];
  remixedAt: Date;
}

// Mock database functions
export class MockDatabase {
  private users: User[] = [];
  private files: UploadedFile[] = [];
  private traits: NounTraits[] = [];
  private gifs: GeneratedGif[] = [];
  private mints: NftMint[] = [];
  private remixes: Remix[] = [];

  // User operations
  async createUser(walletAddress: string, farcasterId?: string): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}`,
      walletAddress,
      farcasterId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return user;
  }

  async getUserByWallet(walletAddress: string): Promise<User | null> {
    return this.users.find(u => u.walletAddress === walletAddress) || null;
  }

  // File operations
  async createFile(userId: string, fileName: string, fileSize: number, fileType: string, fileUrl: string): Promise<UploadedFile> {
    const file: UploadedFile = {
      id: `file_${Date.now()}`,
      userId,
      fileName,
      fileSize,
      fileType,
      fileUrl,
      uploadedAt: new Date(),
    };
    this.files.push(file);
    return file;
  }

  async getFileById(fileId: string): Promise<UploadedFile | null> {
    return this.files.find(f => f.id === fileId) || null;
  }

  // Traits operations
  async createTraits(fileId: string, traits: Omit<NounTraits, 'id' | 'fileId' | 'detectedAt'>): Promise<NounTraits> {
    const nounTraits: NounTraits = {
      id: `traits_${Date.now()}`,
      fileId,
      ...traits,
      detectedAt: new Date(),
    };
    this.traits.push(nounTraits);
    return nounTraits;
  }

  async getTraitsByFileId(fileId: string): Promise<NounTraits | null> {
    return this.traits.find(t => t.fileId === fileId) || null;
  }

  // GIF operations
  async createGif(fileId: string, userId: string, originalTraitsId: string, noggleColor: string, eyeAnimation: string, gifUrl: string, metadata: Record<string, unknown>): Promise<GeneratedGif> {
    const gif: GeneratedGif = {
      id: `gif_${Date.now()}`,
      fileId,
      userId,
      originalTraitsId,
      noggleColor,
      eyeAnimation,
      gifUrl,
      metadata,
      generatedAt: new Date(),
    };
    this.gifs.push(gif);
    return gif;
  }

  async getGifById(gifId: string): Promise<GeneratedGif | null> {
    return this.gifs.find(g => g.id === gifId) || null;
  }

  async getUserGifs(userId: string): Promise<GeneratedGif[]> {
    return this.gifs.filter(g => g.userId === userId);
  }

  // NFT operations
  async createMint(gifId: string, userId: string, tokenId: string, contractAddress: string, transactionHash: string): Promise<NftMint> {
    const mint: NftMint = {
      id: `mint_${Date.now()}`,
      gifId,
      userId,
      tokenId,
      contractAddress,
      transactionHash,
      mintedAt: new Date(),
    };
    this.mints.push(mint);
    return mint;
  }

  async getMintByGifId(gifId: string): Promise<NftMint | null> {
    return this.mints.find(m => m.gifId === gifId) || null;
  }

  // Remix operations
  async createRemix(originalGifId: string, remixedGifId: string, remixerId: string): Promise<Remix> {
    const remix: Remix = {
      id: `remix_${Date.now()}`,
      originalGifId,
      remixedGifId,
      remixerId,
      attributionChain: [originalGifId],
      remixedAt: new Date(),
    };
    this.remixes.push(remix);
    return remix;
  }

  async getRemixesByGifId(gifId: string): Promise<Remix[]> {
    return this.remixes.filter(r => r.originalGifId === gifId);
  }

  // Analytics
  async getStats(): Promise<{
    totalUsers: number;
    totalFiles: number;
    totalGifs: number;
    totalMints: number;
    totalRemixes: number;
  }> {
    return {
      totalUsers: this.users.length,
      totalFiles: this.files.length,
      totalGifs: this.gifs.length,
      totalMints: this.mints.length,
      totalRemixes: this.remixes.length,
    };
  }
}

// Export singleton instance
export const db = new MockDatabase(); 