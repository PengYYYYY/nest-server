import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(data) {
    try {
      const res = this.prisma.userRole.create({ data });
      return res;
    } catch {
      throw new HttpException('新建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(pageSize, page, params) {
    const where = {};

    if (params.userRoleId && params.userRoleId.length) {
      where['id'] = {
        in: params.userRoleId,
      };
    }

    if (params.searchText) {
      where['OR'] = [{ name: { contains: params.searchText } }];
    }

    if (params.createdAt && params.createdAt.length) {
      where['createdAt'] = {
        gt: new Date(params.createdAt[0]),
        lt: new Date(params.createdAt[1]),
      };
    }

    try {
      if (pageSize === 0) return await this.prisma.userRole.findMany({ where });

      const [rows, count] = await Promise.all([
        this.prisma.userRole.findMany({
          take: pageSize,
          skip: (page - 1 || 0) * pageSize,
          where,
        }),
        this.prisma.userRole.count({ where }),
      ]);

      return { count, rows, pageSize: params.pageSize };
    } catch (e) {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOne(id: number) {
    try {
      const res = await this.prisma.userRole.findUnique({
        where: { id },
      });
      if (!res) throw 'not found';
    } catch (e) {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, data) {
    try {
      return await this.prisma.userRole.update({
        data,
        where: { id },
      });
    } catch (e) {
      throw new HttpException('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.prisma.userRole.delete({
        where: { id },
      });
      return {
        message: '删除成功',
        data: res.id,
      };
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
