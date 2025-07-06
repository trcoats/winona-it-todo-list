using Scalar.AspNetCore;
using ToDoList.Data;
using ToDoList.Repositories;
using ToDoList.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("test", policy => policy.WithOrigins("http://localhost:5173"));
});

builder.Services.AddDbContext<ToDoListInMemoryDbContext>();
builder.Services.AddScoped<IToDoListRepository, ToDoListRepository>();
builder.Services.AddScoped<IToDoListService, ToDoListService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseCors("test");

app.UseAuthorization();

app.MapControllers();

app.Run();