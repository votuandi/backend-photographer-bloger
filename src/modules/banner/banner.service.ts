import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { BannerEntity } from 'src/entities/banner.entity'
import { CreateBannerDto, UpdateBannerDto } from 'src/dto/banner.dto'
import { generateRandomString } from 'src/utils/helpers/common.helpers'
import { join } from 'path'
import * as fs from 'fs'

@Injectable()
export class BannerService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(BannerEntity)
    private readonly bannerRepository: Repository<BannerEntity>,
  ) {}

  async create(createBannerDto: CreateBannerDto, image: Express.Multer.File): Promise<BannerEntity | null> {
    try {
      console.log('DTO_CREATE_BANNER:', createBannerDto)

      let createTime = new Date()
      let savedImageName = `banner_thumb_${createTime.getTime()}_${generateRandomString(10)}.${
        image.originalname.split('.').reverse()[0]
      }`
      let savedThumbnailPath = join(this.configService.get('MEDIA_UPLOAD_PATH'), 'banner', savedImageName)
      try {
        fs.writeFileSync(savedThumbnailPath, image.buffer)
      } catch (error) {
        console.log('Error when saving image: ', error)
        return null
      }

      let amount: number = await this.bannerRepository.count({ where: { device: createBannerDto.device } })
      let newBanner = {
        ...createBannerDto,
        createTime: createTime,
        path: savedThumbnailPath,
        index: amount,
      }
      let banner = this.bannerRepository.create(newBanner)
      return await this.bannerRepository.save(banner)
    } catch (error) {
      console.log('ERROR_CREATE_CATEGORY:', error)

      return null
    }
  }

  async findAll(): Promise<BannerEntity[] | null> {
    try {
      let bannerList = await this.bannerRepository.find({
        order: {
          index: 'ASC',
        },
      })
      let newBannerList: BannerEntity[] = []
      bannerList.forEach((bnn) => {
        let newCategory: BannerEntity = {
          ...bnn,
          path: `${this.configService.get('API_HOST')}/${bnn.path}`,
        }
        newBannerList.push(newCategory)
      })
      return newBannerList
    } catch (error) {
      return null
    }
  }

  async findByDevice(device: string): Promise<BannerEntity[] | null> {
    try {
      let bannerList = await this.bannerRepository.find({
        where: {
          device: device,
        },
        order: {
          index: 'ASC',
        },
      })
      let newBannerList: BannerEntity[] = []
      bannerList.forEach((bnn) => {
        let newCategory: BannerEntity = {
          ...bnn,
          path: `${this.configService.get('API_HOST')}/${bnn.path}`,
        }
        newBannerList.push(newCategory)
      })
      return newBannerList
    } catch (error) {
      return null
    }
  }

  async update(id: string, updateBannerDto: UpdateBannerDto): Promise<BannerEntity[] | null> {
    try {
      console.log('DTO_UPDATE_BANNER', updateBannerDto)

      let currentBanner = await this.bannerRepository.findOne({ where: { id } })
      if (!currentBanner) {
        return null
      }

      let switchIndex: number = currentBanner.index + (updateBannerDto.action === 'up' ? -1 : +1)
      console.log(updateBannerDto.action, currentBanner.index, switchIndex)

      let switchBanner = await this.bannerRepository.findOne({
        where: { device: currentBanner.device, index: switchIndex },
      })
      if (!switchBanner) {
        return null
      }

      await this.bannerRepository.update(id, { index: switchBanner.index })
      await this.bannerRepository.update(switchBanner.id, { index: currentBanner.index })
      let bannerList = await this.bannerRepository.find({
        where: {
          device: currentBanner.device,
        },
        order: {
          index: 'ASC',
        },
      })
      let newBannerList: BannerEntity[] = []
      bannerList.forEach((bnn) => {
        let newCategory: BannerEntity = {
          ...bnn,
          path: `${this.configService.get('API_HOST')}/${bnn.path}`,
        }
        newBannerList.push(newCategory)
      })
      return newBannerList
    } catch (error) {
      console.log('ERROR:', error)
      return null
    }
  }

  async remove(id: string): Promise<number> {
    try {
      let existedBanner = await this.bannerRepository.findOne({
        where: { id },
      })
      if (existedBanner) {
        let result = await this.bannerRepository.delete(id)
        try {
          await fs.promises.unlink(existedBanner.path)
        } catch (error) {
          console.log('ERROR DELETE BANNER IMAGE:', error)
        }
        return result.affected
      }
    } catch (error) {
      console.log(error)
      return -1
    }
  }
}
