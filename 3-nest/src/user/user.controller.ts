import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {

    constructor(private readonly userService:UserService){}

    @Get("/all")
    getAllUsers(@Body() body:any){
        return this.userService.userLog();
    }

    @Post("/register")
    postUser(@Body() body:any){
        return this.userService.addUser(body);
    }

    @Get("/:id")
    getOneUser(@Param("id") id:string){
        return this.userService.getUser(id);
    }

    @Put("/:id")
    replaceInfo(@Body() body:any, @Param("id") id:string){
        return this.userService.replaceUser(body, id);
    }

    //to finish
    @Patch("/:id")
    updateInfo(@Body() body:any, @Param("id") id:string){
        return this.userService.updateUser(body, id);
    }

    @Delete("/:id")
    delete(@Param("id") id:string){
        return this.userService.deleteUser(id);
    }

    @Post("/login")
    userLogin(@Body("email") email:string, @Body("password") password:string){
        return this.userService.check(email, password);
    }

    @Get("/search/:term")
    findUser(@Param("term") term:any){
        return this.userService.searchUser(term);
    }

    

}
