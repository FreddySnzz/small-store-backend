import { Module } from '@nestjs/common';
import { CacheModule as CacheModuleFunction } from '@nestjs/cache-manager';

import { CacheService } from './cache.service';

@Module({
  imports: [CacheModuleFunction.register({
    ttl: 300
  })],
  providers: [CacheService],
  exports: [CacheService],
})

export class CacheModule {}
