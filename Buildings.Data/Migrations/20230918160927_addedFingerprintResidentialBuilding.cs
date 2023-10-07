using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Buildings.Data.Migrations
{
    /// <inheritdoc />
    public partial class addedFingerprintResidentialBuilding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "ResidentialBuildings",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<long>(
                name: "CreatedById",
                table: "ResidentialBuildings",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_ResidentialBuildings_CreatedById",
                table: "ResidentialBuildings",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_ResidentialBuildings_AspNetUsers_CreatedById",
                table: "ResidentialBuildings",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ResidentialBuildings_AspNetUsers_CreatedById",
                table: "ResidentialBuildings");

            migrationBuilder.DropIndex(
                name: "IX_ResidentialBuildings_CreatedById",
                table: "ResidentialBuildings");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "ResidentialBuildings");

            migrationBuilder.DropColumn(
                name: "CreatedById",
                table: "ResidentialBuildings");
        }
    }
}
