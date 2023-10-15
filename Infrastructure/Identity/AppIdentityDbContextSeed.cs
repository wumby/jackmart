
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager){
            if(!userManager.Users.Any()){
                var user = new AppUser{
                    DisplayName="'Jack'",
                    Email="test.com",
                    UserName="username",
                    Address= new Address{
                        FirstName="Jack",
                        LastName="Ziegler",
                        Street="1600 Hoyt",
                        State="80215",
                        ZipCode="58701"
                    }
                };
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}