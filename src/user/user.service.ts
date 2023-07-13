import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { makeSalt, encryptPassword } from '../utils/cryptogram'; // 引入加密函数

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data) {
    const { phone, password } = data;
    const user = await this.findByPhone(phone);
    if (user) {
      throw new HttpException('用户已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码

    try {
      return await this.prisma.user.create({
        data: { ...data, password: hashPwd, salt },
      });
    } catch (e) {
      throw new HttpException('新建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createRoot(data) {
    const { phone, password } = data;
    const user = await this.findByPhone(phone);
    if (user) {
      throw new HttpException('用户已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const users = await this.prisma.user.findMany({
      where: {},
    });
    if (!users.length) {
      throw new HttpException('已存在管理员', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const salt = makeSalt(); // 制作密码盐
    const hashPwd = encryptPassword(password, salt); // 加密密码

    try {
      return await this.prisma.$transaction(async (tx) => {
        const userRole = await tx.userRole.create({
          data: {
            name: 'root',
            menuList: ['all'],
            operationList: ['all'],
          },
        });
        const user = await tx.user.create({
          data: {
            name: 'root',
            phone,
            password: hashPwd,
            salt,
            userRoleId: userRole.id,
          },
        });
        return user;
      });
    } catch (e) {
      throw new HttpException('新建失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateUserPassword(id, password, salt) {
    const hashPwd = encryptPassword(password, salt);
    try {
      const res = await this.prisma.user.update({
        data: { password: hashPwd },
        where: { id },
      });
      const { salt: newSlat, password: newPws, ...user } = res;
      return user;
    } catch (e) {
      throw new HttpException('更新', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(pageSize, page, params) {
    const where = {};

    if (params.searchText) {
      where['OR'] = [{ name: { contains: params.searchText } }];
    }

    if (params.createdAt?.length) {
      where['createdAt'] = {
        gt: new Date(params.createdAt[0]),
        lt: new Date(params.createdAt[1]),
      };
    }

    if (params.userRoleId?.length) {
      where['userRoleId'] = {
        in: params.userRoleId,
      };
    }

    try {
      if (pageSize === 0) return await this.prisma.user.findMany({ where });

      const [rows, count] = await Promise.all([
        this.prisma.user.findMany({
          take: pageSize,
          skip: (page - 1 || 0) * pageSize,
          where,
          include: {
            userRole: {
              select: {
                name: true,
              },
            },
          },
        }),
        this.prisma.user.count({ where }),
      ]);

      return { count, rows, pageSize: params.pageSize };
    } catch (e) {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByPhone(phone: string) {
    try {
      const res = await this.prisma.user.findFirst({
        where: { phone, enable: true },
        include: {
          userRole: true,
        },
      });
      return res;
    } catch (e) {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number) {
    try {
      const res = await this.prisma.user.findFirst({
        where: { id, enable: true },
      });
      return res;
    } catch (e) {
      throw new HttpException('查询失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, data) {
    try {
      return await this.prisma.user.update({
        data,
        where: { id },
      });
    } catch (e) {
      throw new HttpException('更新失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(id: number) {
    try {
      const res = await this.prisma.user.delete({
        where: { id },
      });
      return res.id;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
