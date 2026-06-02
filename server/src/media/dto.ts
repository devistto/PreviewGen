import { Transform } from "class-transformer";
import { IsBoolean, IsHexColor, IsIn, IsNumber, IsString, Max, Min } from "class-validator";

export class CustomPreviewDto {
    @IsIn(["2x2", "3x3", "4x4", "5x5"])
    grid!: string;

    @Transform((data) => Number(data.value))
    @IsNumber()
    @IsIn([0, 2, 4, 6, 8, 10])
    spacing!: number;

    @IsIn(["9:16", "16:9", "4:3", "1:1"])
    ratio!: string;

    @IsHexColor()
    backgroundColor!: string;

    @IsHexColor()
    textColor!: string;

    @IsIn(["OpenSans", "Outfit", "Roboto", "PlusJakartaSans", "Inter" ])
    font!: string;

    @Transform(({ value }) => value === "true" || value === true)
    @IsBoolean()
    timestamps!: boolean;

    @Transform(({ value }) => value === "true" || value === true)
    @IsBoolean()
    metadata!: boolean;

    @IsIn(["png", "jpeg", "webp"])
    outputFormat!: string;
}