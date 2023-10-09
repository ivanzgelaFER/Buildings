using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Buildings.Data.Migrations
{
    /// <inheritdoc />
    public partial class ResidentialBuilding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ResidentialBuildingId",
                table: "AspNetUsers",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateTable(
                name: "ResidentialBuildings",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Guid = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Address = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ResidentialBuildings", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_ResidentialBuildingId",
                table: "AspNetUsers",
                column: "ResidentialBuildingId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_ResidentialBuildings_ResidentialBuildingId",
                table: "AspNetUsers",
                column: "ResidentialBuildingId",
                principalTable: "ResidentialBuildings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_ResidentialBuildings_ResidentialBuildingId",
                table: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "ResidentialBuildings");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_ResidentialBuildingId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ResidentialBuildingId",
                table: "AspNetUsers");
        }
    }
}
