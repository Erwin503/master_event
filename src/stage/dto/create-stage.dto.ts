import { IsNotEmpty, IsNumber, IsString, Matches, MinLength } from 'class-validator';
export class CreateStageDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @Matches(/[a-zA-Z]/, {
        message: 'Title must contain at least one letter'
    })
    title: string;


    @IsNumber()
    @IsNotEmpty()
    event_id: number;
}